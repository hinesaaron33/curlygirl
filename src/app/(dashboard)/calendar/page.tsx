"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  TOPIC_COLORS,
  TOPIC_BAR_COLORS,
  DAYS,
  MONTHS,
} from "@/lib/mock/lesson-plans";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DeliveredLesson {
  lessonPlanId: string;
  title: string;
  gradeLevel: string;
  topic: string;
  languageSkill: string;
}

interface ScheduleEntry {
  startDate: string; // ISO date (YYYY-MM-DD)
  endDate: string;   // ISO date (YYYY-MM-DD)
}

interface ScheduledLesson extends DeliveredLesson, ScheduleEntry {
  id: string;
}

interface LessonSegment {
  lesson: ScheduledLesson;
  startCol: number; // 0-indexed column in the week (0=Sun, 6=Sat)
  endCol: number;   // 0-indexed column (inclusive)
  isStart: boolean; // true if this segment contains the lesson's actual start
  isEnd: boolean;   // true if this segment contains the lesson's actual end
}

// ─── Schedule persistence (per-device for now; DB-backed model can replace) ──

const SCHEDULE_STORAGE_KEY = "cg-lesson-schedule-v1";

function loadSchedule(): Record<string, ScheduleEntry> {
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSchedule(schedule: Record<string, ScheduleEntry>) {
  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedule));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTopicColor(topic: string) {
  return TOPIC_COLORS[topic] || "bg-white/10 text-white/70";
}

function getTopicBarColor(topic: string) {
  return TOPIC_BAR_COLORS[topic] || "bg-white/10 text-white/70 border-white/20";
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function parseDate(s: string): Date {
  return new Date(s + "T00:00:00");
}

function formatShortDate(d: Date): string {
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

function addDays(dateKey: string, days: number): string {
  const d = parseDate(dateKey);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

// Assign lesson segments to lanes within a week (greedy algorithm)
function assignLanes(segments: LessonSegment[]): LessonSegment[][] {
  const sorted = [...segments].sort((a, b) => a.startCol - b.startCol || a.endCol - b.endCol);
  const lanes: LessonSegment[][] = [];

  for (const seg of sorted) {
    let placed = false;
    for (const lane of lanes) {
      const lastInLane = lane[lane.length - 1];
      if (lastInLane.endCol < seg.startCol) {
        lane.push(seg);
        placed = true;
        break;
      }
    }
    if (!placed) {
      lanes.push([seg]);
    }
  }

  return lanes;
}

// ─── Scheduling card for lessons not yet on the calendar ────────────────────

function UnscheduledCard({
  lesson,
  onSchedule,
}: {
  lesson: DeliveredLesson;
  onSchedule: (lessonPlanId: string, entry: ScheduleEntry) => void;
}) {
  const [startDate, setStartDate] = useState(() => toDateKey(new Date()));
  const [duration, setDuration] = useState(5);

  return (
    <div className="rounded-lg border border-[#3a7f90] bg-[#418DA2] p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-gray-100">{lesson.title}</p>
        <span className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getTopicColor(lesson.topic)}`}>
          {lesson.topic}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-sm text-gray-100 [color-scheme:dark]"
        />
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-sm text-gray-100 [color-scheme:dark]"
        >
          {[1, 2, 3, 4, 5, 7, 10].map((d) => (
            <option key={d} value={d}>
              {d} {d === 1 ? "day" : "days"}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            startDate &&
            onSchedule(lesson.lessonPlanId, {
              startDate,
              endDate: addDays(startDate, duration - 1),
            })
          }
          className="rounded-lg bg-coral-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-coral-600"
        >
          Add to calendar
        </button>
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

const WEEK_GRID_COLS = { gridTemplateColumns: "0.5fr 1fr 1fr 1fr 1fr 1fr 0.5fr" };

type TabView = "calendar" | "queue";

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<TabView>("calendar");
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [delivered, setDelivered] = useState<DeliveredLesson[]>([]);
  const [schedule, setSchedule] = useState<Record<string, ScheduleEntry>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();

  useEffect(() => {
    setSchedule(loadSchedule());

    fetch("/api/my-plans")
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || "Failed to load your lessons");
        }
        return res.json();
      })
      .then((body) => {
        type CopyRow = {
          lessonPlanId: string;
          lessonPlan: {
            title: string;
            gradeLevel: string;
            topic: string;
            languageSkill: string;
          };
        };
        setDelivered(
          (body.copies as CopyRow[]).map((c) => ({
            lessonPlanId: c.lessonPlanId,
            title: c.lessonPlan.title,
            gradeLevel: c.lessonPlan.gradeLevel,
            topic: c.lessonPlan.topic,
            languageSkill: c.lessonPlan.languageSkill,
          }))
        );
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  function updateSchedule(next: Record<string, ScheduleEntry>) {
    setSchedule(next);
    saveSchedule(next);
  }

  function scheduleLesson(lessonPlanId: string, entry: ScheduleEntry) {
    updateSchedule({ ...schedule, [lessonPlanId]: entry });
  }

  function unscheduleLesson(lessonPlanId: string) {
    const next = { ...schedule };
    delete next[lessonPlanId];
    updateSchedule(next);
  }

  const scheduledLessons = useMemo<ScheduledLesson[]>(
    () =>
      delivered
        .filter((l) => schedule[l.lessonPlanId])
        .map((l) => ({
          ...l,
          ...schedule[l.lessonPlanId],
          id: l.lessonPlanId,
        })),
    [delivered, schedule]
  );

  const unscheduledLessons = useMemo(
    () => delivered.filter((l) => !schedule[l.lessonPlanId]),
    [delivered, schedule]
  );

  // Build calendar grid days for the current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay(); // 0=Sun
    const days: Date[] = [];

    // Pad with previous month days before the 1st
    for (let i = startPad - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push(d);
    }
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    // Pad with next month days to fill the last week
    let nextDay = 1;
    while (days.length % 7 !== 0) {
      days.push(new Date(year, month + 1, nextDay++));
    }

    return days;
  }, [currentDate]);

  // Chunk calendar days into weeks
  const weeks = useMemo(() => {
    const result: Date[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7));
    }
    return result;
  }, [calendarDays]);

  // Compute lesson segments per week with lane assignments
  const weekLanes = useMemo(() => {
    return weeks.map((week) => {
      // Find the date range of this week row
      const weekDates = week.map((d, col) => ({ date: d, col }));
      const firstDate = weekDates[0];
      const lastDate = weekDates[6];

      // For each lesson, check if it overlaps this week
      const segments: LessonSegment[] = [];

      for (const lesson of scheduledLessons) {
        const lessonStart = parseDate(lesson.startDate);
        const lessonEnd = parseDate(lesson.endDate);

        // Check overlap: lesson must start before/on last day AND end after/on first day
        if (lessonEnd < firstDate.date || lessonStart > lastDate.date) continue;

        // Find start and end columns for this lesson within this week
        let startCol = -1;
        let endCol = -1;
        for (let col = 0; col < 7; col++) {
          const d = week[col];
          const dk = toDateKey(d);
          const lsk = lesson.startDate;
          const lek = lesson.endDate;
          if (dk >= lsk && dk <= lek) {
            if (startCol === -1) startCol = col;
            endCol = col;
          }
        }

        if (startCol === -1) continue;

        const isStart = toDateKey(week[startCol]) === lesson.startDate;
        const isEnd = toDateKey(week[endCol]) === lesson.endDate;

        segments.push({ lesson, startCol, endCol, isStart, isEnd });
      }

      return assignLanes(segments);
    });
  }, [weeks, scheduledLessons]);

  // Upcoming lessons sorted chronologically (from today onward)
  const upcomingLessons = useMemo(() => {
    const todayKey = toDateKey(today);
    return [...scheduledLessons]
      .filter((l) => l.endDate >= todayKey)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduledLessons]);

  // Group upcoming lessons by week
  const weekGroups = useMemo(() => {
    const groups: { weekLabel: string; lessons: ScheduledLesson[] }[] = [];
    let currentWeekStart: string | null = null;
    let currentGroup: ScheduledLesson[] = [];

    for (const lesson of upcomingLessons) {
      const d = parseDate(lesson.startDate);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = toDateKey(weekStart);

      if (key !== currentWeekStart) {
        if (currentGroup.length) {
          const ws = parseDate(currentWeekStart!);
          const we = new Date(ws);
          we.setDate(ws.getDate() + 6);
          groups.push({
            weekLabel: `${MONTHS[ws.getMonth()]} ${ws.getDate()} – ${ws.getMonth() !== we.getMonth() ? MONTHS[we.getMonth()] + " " : ""}${we.getDate()}`,
            lessons: currentGroup,
          });
        }
        currentWeekStart = key;
        currentGroup = [lesson];
      } else {
        currentGroup.push(lesson);
      }
    }
    if (currentGroup.length && currentWeekStart) {
      const ws = parseDate(currentWeekStart);
      const we = new Date(ws);
      we.setDate(ws.getDate() + 6);
      groups.push({
        weekLabel: `${MONTHS[ws.getMonth()]} ${ws.getDate()} – ${ws.getMonth() !== we.getMonth() ? MONTHS[we.getMonth()] + " " : ""}${we.getDate()}`,
        lessons: currentGroup,
      });
    }

    return groups;
  }, [upcomingLessons]);

  function prevMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Calendar</h1>
        <p className="mt-1 text-sm text-white/60">Plan your delivered lessons by date</p>
        <div className="mt-8 text-sm text-white/60">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Calendar</h1>
        <p className="mt-4 text-sm text-coral-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Calendar</h1>
        <p className="mt-1 text-sm text-white/60">
          Plan when to teach the lessons in your library
        </p>
      </div>

      {delivered.length === 0 && (
        <div className="mt-6 rounded-lg border border-[#3a7f90] bg-[#418DA2] p-6 text-center">
          <p className="text-sm text-white/90">
            You don&apos;t have any lessons yet. Once you get lessons from the
            library, you can schedule them here.
          </p>
          <Link
            href="/library"
            className="mt-4 inline-block rounded-lg bg-coral-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-coral-600"
          >
            Browse the library
          </Link>
        </div>
      )}

      {delivered.length > 0 && (
        <>
          {/* Tab switcher */}
          <div className="relative mt-6">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-[#84F1EC]/40" />
            <nav className="relative flex gap-1">
              <button
                onClick={() => setActiveTab("calendar")}
                className={`relative rounded-t-lg px-4 py-2 text-base font-medium transition-colors ${
                  activeTab === "calendar"
                    ? "border-3 border-[#84F1EC] border-b-transparent bg-admin-sidebar text-white"
                    : "border border-transparent text-white/60 hover:border-gold hover:border-b-transparent hover:text-white/80"
                }`}
              >
                Calendar View
              </button>
              <button
                onClick={() => setActiveTab("queue")}
                className={`relative rounded-t-lg px-4 py-2 text-base font-medium transition-colors ${
                  activeTab === "queue"
                    ? "border-3 border-[#84F1EC] border-b-transparent bg-admin-sidebar text-white"
                    : "border border-transparent text-white/60 hover:border-gold hover:border-b-transparent hover:text-white/80"
                }`}
              >
                Queue
                {unscheduledLessons.length > 0 && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
                    {unscheduledLessons.length} to schedule
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* ─── Calendar View ─── */}
          {activeTab === "calendar" && (
            <div className="mt-6">
              {/* Month navigation */}
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={prevMonth}
                  className="rounded-lg p-2 text-white/70 transition-colors hover:bg-[#3a7f90] hover:text-white"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-100">
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={nextMonth}
                  className="rounded-lg p-2 text-white/70 transition-colors hover:bg-[#3a7f90] hover:text-white"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>

              {scheduledLessons.length === 0 && (
                <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                  <p className="text-sm text-amber-200">
                    Nothing scheduled yet — use the{" "}
                    <button
                      onClick={() => setActiveTab("queue")}
                      className="font-medium text-amber-100 underline hover:no-underline"
                    >
                      Queue
                    </button>{" "}
                    tab to put your lessons on the calendar.
                  </p>
                </div>
              )}

              {/* Day headers */}
              <div className="grid gap-px rounded-t-lg bg-white/20" style={WEEK_GRID_COLS}>
                {DAYS.map((day, i) => (
                  <div
                    key={day}
                    className={`border border-white/15 px-2 py-2 text-center text-xs font-semibold uppercase text-white/60 ${
                      i === 0 || i === 6 ? "bg-gray-400/20" : "bg-[#418DA2]/30"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid - week rows */}
              <div className="rounded-b-lg">
                {weeks.map((week, weekIdx) => {
                  const lanes = weekLanes[weekIdx];
                  const laneCount = lanes.length;

                  return (
                    <div key={weekIdx} className="relative">
                      {/* Day cells */}
                      <div className="grid" style={WEEK_GRID_COLS}>
                        {week.map((day, colIdx) => {
                          const isWeekend = colIdx === 0 || colIdx === 6;
                          const isOutsideMonth = day.getMonth() !== currentDate.getMonth();
                          const isToday = isSameDay(day, today);
                          const isGrey = isWeekend || isOutsideMonth;

                          return (
                            <div
                              key={toDateKey(day) + colIdx}
                              className={`border border-white/15 px-1.5 pt-1.5 ${
                                isGrey ? "bg-gray-400/20" : "bg-[#418DA2]/30"
                              } ${isToday ? "border-orange-400" : ""}`}
                              style={{ minHeight: `${44 + laneCount * 26}px` }}
                            >
                              <span
                                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                                  isToday ? "bg-orange-400 text-black" : isOutsideMonth ? "text-white/40" : "text-white/70"
                                }`}
                              >
                                {day.getDate()}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Lesson bar lanes overlaid on the day cells */}
                      {lanes.length > 0 && (
                        <div
                          className="pointer-events-none absolute flex flex-col gap-0.5"
                          style={{ top: "36px", left: "8px", right: "8px" }}
                        >
                          {lanes.map((lane, laneIdx) => (
                            <div
                              key={laneIdx}
                              className="grid"
                              style={{ ...WEEK_GRID_COLS, height: "22px" }}
                            >
                              {lane.map((seg) => (
                                <div
                                  key={seg.lesson.id}
                                  className={`pointer-events-auto flex items-center border px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide leading-tight ${getTopicBarColor(seg.lesson.topic)} ${
                                    seg.isStart && seg.isEnd
                                      ? "rounded"
                                      : seg.isStart
                                        ? "rounded-l border-r-0"
                                        : seg.isEnd
                                          ? "rounded-r border-l-0"
                                          : "border-x-0"
                                  }`}
                                  style={{
                                    gridColumn: `${seg.startCol + 1} / ${seg.endCol + 2}`,
                                    marginLeft: seg.isStart ? "4px" : 0,
                                    marginRight: seg.isEnd ? "4px" : 0,
                                  }}
                                  title={`${seg.lesson.title} (${seg.lesson.gradeLevel} · ${seg.lesson.languageSkill})`}
                                >
                                  <span className="truncate">{seg.lesson.title}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Queue View ─── */}
          {activeTab === "queue" && (
            <div className="mt-6 space-y-8">
              {/* Unscheduled lessons */}
              {unscheduledLessons.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
                    Not on the calendar yet
                  </h3>
                  <div className="space-y-3">
                    {unscheduledLessons.map((lesson) => (
                      <UnscheduledCard
                        key={lesson.lessonPlanId}
                        lesson={lesson}
                        onSchedule={scheduleLesson}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Scheduled upcoming lessons */}
              {upcomingLessons.length === 0 ? (
                unscheduledLessons.length === 0 && (
                  <div className="rounded-lg border border-navy-700 bg-[#418DA2] p-6 text-center">
                    <p className="text-sm text-white/90">No upcoming lessons scheduled.</p>
                  </div>
                )
              ) : (
                <div className="space-y-8">
                  {weekGroups.map((group) => (
                    <div key={group.weekLabel}>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
                        {group.weekLabel}
                      </h3>
                      <div className="relative space-y-3 pl-6">
                        {/* Timeline line */}
                        <div className="absolute bottom-0 left-2.5 top-0 w-px bg-[#84F1EC]/30" />

                        {group.lessons.map((lesson) => {
                          const startD = parseDate(lesson.startDate);
                          const endD = parseDate(lesson.endDate);
                          const duration = daysBetween(startD, endD);
                          const isToday = isSameDay(startD, today) || (today >= startD && today <= endD);

                          return (
                            <div key={lesson.id} className="relative flex items-start gap-3">
                              {/* Timeline dot */}
                              <div
                                className={`absolute -left-6 top-3 h-2.5 w-2.5 rounded-full ${
                                  isToday ? "bg-[#84F1EC]" : "bg-[#84F1EC]/50"
                                }`}
                                style={{ left: "-14px" }}
                              />

                              <div className="flex-1 rounded-lg border border-[#3a7f90] bg-[#418DA2] p-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="font-medium text-gray-100">{lesson.title}</p>
                                    <p className="mt-0.5 text-xs text-white/50">
                                      {formatShortDate(startD)} – {formatShortDate(endD)}
                                    </p>
                                  </div>
                                  <div className="flex shrink-0 items-center gap-2">
                                    <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60">
                                      {duration} {duration === 1 ? "day" : "days"}
                                    </span>
                                    <button
                                      onClick={() => unscheduleLesson(lesson.id)}
                                      className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60 transition-colors hover:bg-coral-500/30 hover:text-coral-200"
                                      title="Remove from calendar"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  <span className="inline-flex rounded-full bg-coral-500/20 px-2 py-0.5 text-xs font-medium text-coral-300">
                                    {lesson.gradeLevel}
                                  </span>
                                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getTopicColor(lesson.topic)}`}>
                                    {lesson.topic}
                                  </span>
                                  <span className="inline-flex rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
                                    {lesson.languageSkill}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
