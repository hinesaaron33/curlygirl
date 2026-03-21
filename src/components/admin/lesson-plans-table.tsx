"use client";

import { useState, useEffect, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface LessonPlan {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string;
  topic: string;
  languageSkill: string;
  tags: string[];
  published: boolean;
  googleDriveFileId: string | null;
  googleDriveUrl: string | null;
  createdAt: string;
}

const inputClass =
  "w-full rounded-lg border border-navy-700 bg-[#418DA2] px-3 py-2 text-sm text-gray-200 placeholder:text-white/60 focus:border-coral-500 focus:outline-none focus:ring-1 focus:ring-coral-500";

export function LessonPlansTable({
  onCountChange,
}: {
  onCountChange?: (count: number) => void;
}) {
  const [lessons, setLessons] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [gradeLevelFilter, setGradeLevelFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<LessonPlan | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<LessonPlan | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    gradeLevel: "",
    topic: "",
    languageSkill: "",
    tags: "",
  });

  async function fetchLessons() {
    try {
      const res = await fetch("/api/admin/lessons");
      const data = await res.json();
      if (res.ok) {
        setLessons(data.lessons);
        onCountChange?.(data.lessons.length);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derive unique filter options from data
  const gradeLevels = useMemo(
    () => [...new Set(lessons.map((l) => l.gradeLevel))].sort(),
    [lessons]
  );
  const topics = useMemo(
    () => [...new Set(lessons.map((l) => l.topic))].sort(),
    [lessons]
  );

  // Client-side filtering
  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      if (search && !l.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (statusFilter === "published" && !l.published) return false;
      if (statusFilter === "draft" && l.published) return false;
      if (gradeLevelFilter && l.gradeLevel !== gradeLevelFilter) return false;
      if (topicFilter && l.topic !== topicFilter) return false;
      return true;
    });
  }, [lessons, search, statusFilter, gradeLevelFilter, topicFilter]);

  async function togglePublished(lesson: LessonPlan) {
    setTogglingId(lesson.id);
    const newValue = !lesson.published;
    // Optimistic update
    setLessons((prev) =>
      prev.map((l) => (l.id === lesson.id ? { ...l, published: newValue } : l))
    );
    try {
      const res = await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: newValue }),
      });
      if (!res.ok) {
        // Revert
        setLessons((prev) =>
          prev.map((l) =>
            l.id === lesson.id ? { ...l, published: !newValue } : l
          )
        );
      }
    } catch {
      // Revert
      setLessons((prev) =>
        prev.map((l) =>
          l.id === lesson.id ? { ...l, published: !newValue } : l
        )
      );
    } finally {
      setTogglingId(null);
    }
  }

  function openEdit(lesson: LessonPlan) {
    setEditingLesson(lesson);
    setEditForm({
      title: lesson.title,
      description: lesson.description ?? "",
      gradeLevel: lesson.gradeLevel,
      topic: lesson.topic,
      languageSkill: lesson.languageSkill,
      tags: lesson.tags.join(", "),
    });
  }

  async function handleSave() {
    if (!editingLesson) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/lessons/${editingLesson.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description || null,
          gradeLevel: editForm.gradeLevel,
          topic: editForm.topic,
          languageSkill: editForm.languageSkill,
          tags: editForm.tags
            ? editForm.tags.split(",").map((t) => t.trim())
            : [],
        }),
      });
      if (res.ok) {
        const { lesson } = await res.json();
        setLessons((prev) =>
          prev.map((l) => (l.id === lesson.id ? lesson : l))
        );
        setEditingLesson(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingLesson) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/lessons/${deletingLesson.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLessons((prev) => {
          const next = prev.filter((l) => l.id !== deletingLesson.id);
          onCountChange?.(next.length);
          return next;
        });
        setDeletingLesson(null);
      }
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-white/80">Loading lesson plans...</div>;
  }

  return (
    <div>
      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-9`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | "published" | "draft")
          }
          className={`${inputClass} w-auto`}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select
          value={gradeLevelFilter}
          onChange={(e) => setGradeLevelFilter(e.target.value)}
          className={`${inputClass} w-auto`}
        >
          <option value="">All Grades</option>
          {gradeLevels.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className={`${inputClass} w-auto`}
        >
          <option value="">All Topics</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="mt-3 text-xs text-white/50">
        {filtered.length} of {lessons.length} lesson plans
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="mt-4 rounded-lg border border-navy-700 bg-[#418DA2] p-6 text-center">
          <p className="text-sm text-white/90">
            {lessons.length === 0
              ? "No lesson plans yet. Import them via the Drive Files or Sheet Sync tabs."
              : "No lesson plans match your filters."}
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-lg border border-navy-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#3a7f90] text-xs uppercase text-white/80">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Skill</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700">
              {filtered.map((lp) => (
                <tr
                  key={lp.id}
                  className="bg-[#418DA2] hover:bg-[#3a7f90]/60"
                >
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-medium text-gray-100">
                        {lp.title}
                      </span>
                      {lp.googleDriveFileId && (
                        <span className="ml-2 text-xs text-white/40">
                          Drive
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/80">{lp.gradeLevel}</td>
                  <td className="px-4 py-3 text-white/80">{lp.topic}</td>
                  <td className="px-4 py-3 text-white/80">
                    {lp.languageSkill}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublished(lp)}
                      disabled={togglingId === lp.id}
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                        lp.published
                          ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                      } ${togglingId === lp.id ? "opacity-50" : "cursor-pointer"}`}
                    >
                      {lp.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(lp)}
                        className="rounded p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingLesson(lp)}
                        className="rounded p-1 text-white/60 transition-colors hover:bg-red-500/20 hover:text-red-400"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-lg rounded-xl border border-[#3a7f90] bg-[#418DA2] p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-100">
              Edit Lesson Plan
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Update the lesson plan details below.
            </p>

            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Title *"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className={inputClass}
              />
              <textarea
                placeholder="Description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className={inputClass}
                rows={2}
              />
              <input
                type="text"
                placeholder="Grade Level * (e.g., K-2)"
                value={editForm.gradeLevel}
                onChange={(e) =>
                  setEditForm({ ...editForm, gradeLevel: e.target.value })
                }
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Topic * (e.g., Animals)"
                value={editForm.topic}
                onChange={(e) =>
                  setEditForm({ ...editForm, topic: e.target.value })
                }
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Language Skill * (e.g., Vocabulary)"
                value={editForm.languageSkill}
                onChange={(e) =>
                  setEditForm({ ...editForm, languageSkill: e.target.value })
                }
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={editForm.tags}
                onChange={(e) =>
                  setEditForm({ ...editForm, tags: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setEditingLesson(null)}
                className="rounded-lg border border-navy-700 px-4 py-2 text-sm font-medium text-white/90 hover:bg-[#3a7f90]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={
                  saving ||
                  !editForm.title ||
                  !editForm.gradeLevel ||
                  !editForm.topic ||
                  !editForm.languageSkill
                }
                className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-sm rounded-xl border border-[#3a7f90] bg-[#418DA2] p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-100">
              Delete Lesson Plan
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Are you sure you want to delete{" "}
              <span className="font-medium text-white">
                &ldquo;{deletingLesson.title}&rdquo;
              </span>
              ? This will also remove it from any bundles. This cannot be undone.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeletingLesson(null)}
                className="rounded-lg border border-navy-700 px-4 py-2 text-sm font-medium text-white/90 hover:bg-[#3a7f90]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
