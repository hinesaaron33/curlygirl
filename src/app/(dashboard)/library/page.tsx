"use client";

import { useState, useEffect, useMemo } from "react";

type AccessState = "included" | "unlocked" | "available" | "locked";

interface LibraryPlan {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string;
  topic: string;
  languageSkill: string;
  tags: string[];
  googleDriveUrl: string | null;
  accessState: AccessState;
}

interface LibraryData {
  plans: LibraryPlan[];
  googleConnected: boolean;
  creditsRemaining: number;
}

type Filter = "browse" | "unlocked";

export default function LibraryPage() {
  const [filter, setFilter] = useState<Filter>("browse");
  const [data, setData] = useState<LibraryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [copiedIds, setCopiedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/library");
        if (!res.ok) throw new Error("Failed to load library");
        setData(await res.json());
      } catch {
        setError("Could not load the resource library. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredPlans = useMemo(() => {
    if (!data) return [];
    if (filter === "unlocked") {
      return data.plans.filter(
        (p) => p.accessState === "included" || p.accessState === "unlocked"
      );
    }
    // "browse" shows available plans (not yet unlocked)
    return data.plans.filter((p) => p.accessState === "available");
  }, [data, filter]);

  const browseCount = data?.plans.filter((p) => p.accessState === "available").length ?? 0;
  const unlockedCount =
    data?.plans.filter(
      (p) => p.accessState === "included" || p.accessState === "unlocked"
    ).length ?? 0;

  async function handleGetLesson(plan: LibraryPlan) {
    if (!data?.googleConnected) {
      window.location.href = "/api/auth/google";
      return;
    }

    setCopyingId(plan.id);
    try {
      if (plan.accessState === "available") {
        // Spend a credit and copy
        const res = await fetch("/api/credits/spend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonPlanId: plan.id }),
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || "Failed to unlock lesson");
        }
        const result = await res.json();
        // Update local credits count
        setData((prev) =>
          prev ? { ...prev, creditsRemaining: result.creditsRemaining } : prev
        );
      } else {
        // Already included/unlocked — just copy
        const res = await fetch("/api/drive/copy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonPlanId: plan.id }),
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || "Failed to copy lesson");
        }
      }
      setCopiedIds((prev) => new Set(prev).add(plan.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCopyingId(null);
    }
  }

  function buttonLabel(plan: LibraryPlan) {
    if (copiedIds.has(plan.id)) return "Copied to Drive ✓";
    if (copyingId === plan.id) return "Copying...";
    if (!data?.googleConnected) return "Connect Google Drive";
    if (plan.accessState === "available") return "Use 1 credit to unlock";
    if (plan.accessState === "locked") return "Subscribe to access";
    return "Get this lesson";
  }

  function buttonDisabled(plan: LibraryPlan) {
    if (copiedIds.has(plan.id)) return true;
    if (copyingId !== null) return true;
    if (plan.accessState === "locked") return true;
    return false;
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Resource Library</h1>
        <p className="mt-1 text-sm text-white/60">
          Browse and get lesson plans copied to your Google Drive
        </p>
        <div className="mt-8 text-sm text-white/60">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Resource Library</h1>
        <p className="mt-4 text-sm text-coral-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Resource Library</h1>
          <p className="mt-1 text-sm text-white/60">
            Browse and get lesson plans copied to your Google Drive
          </p>
        </div>
        {data && data.creditsRemaining >= 0 && (
          <div className="shrink-0 rounded-lg border border-[#3a7f90] bg-[#418DA2] px-4 py-2 text-center">
            <p className="text-xs text-white/60">Credits</p>
            <p className="text-lg font-bold text-gray-100">
              {data.creditsRemaining}
            </p>
          </div>
        )}
      </div>

      {!data?.googleConnected && (
        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <p className="text-sm text-amber-200">
            Connect your Google account to copy lesson plans to your Drive.{" "}
            <a
              href="/api/auth/google"
              className="font-medium text-amber-100 underline hover:no-underline"
            >
              Connect now
            </a>
          </p>
        </div>
      )}

      {/* Filter toggle */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setFilter("browse")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
            filter === "browse"
              ? "bg-coral-500 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80"
          }`}
        >
          Available
          <span
            className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
              filter === "browse"
                ? "bg-white/20 text-white"
                : "bg-white/10 text-white/50"
            }`}
          >
            {browseCount}
          </span>
        </button>
        <button
          onClick={() => setFilter("unlocked")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
            filter === "unlocked"
              ? "bg-coral-500 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80"
          }`}
        >
          My Lessons
          <span
            className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
              filter === "unlocked"
                ? "bg-white/20 text-white"
                : "bg-white/10 text-white/50"
            }`}
          >
            {unlockedCount}
          </span>
        </button>
      </div>

      {filteredPlans.length === 0 ? (
        <div className="mt-8 rounded-lg border border-[#3a7f90] bg-[#418DA2] p-6 text-center">
          <p className="text-sm text-white/80">
            {filter === "browse"
              ? "No available lesson plans right now."
              : "You haven\u2019t unlocked any lessons yet."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-lg border border-[#3a7f90] bg-[#418DA2] p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-gray-100">
                  {plan.title}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    plan.accessState === "included"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : plan.accessState === "unlocked"
                        ? "bg-[#84F1EC]/20 text-[#84F1EC]"
                        : plan.accessState === "available"
                          ? "bg-white/10 text-white/60"
                          : "bg-white/5 text-white/40"
                  }`}
                >
                  {plan.accessState === "included"
                    ? "Included"
                    : plan.accessState === "unlocked"
                      ? "Unlocked"
                      : plan.accessState === "available"
                        ? "1 credit"
                        : "Locked"}
                </span>
              </div>
              {plan.description && (
                <p className="mt-1 text-sm text-white/70">{plan.description}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-coral-500/20 px-2.5 py-0.5 text-xs font-medium text-coral-400">
                  {plan.gradeLevel}
                </span>
                <span className="rounded-full bg-[#84F1EC]/20 px-2.5 py-0.5 text-xs font-medium text-[#84F1EC]">
                  {plan.topic}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                  {plan.languageSkill}
                </span>
              </div>
              {plan.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {plan.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <button
                  disabled={buttonDisabled(plan)}
                  onClick={() => handleGetLesson(plan)}
                  className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    copiedIds.has(plan.id)
                      ? "bg-emerald-500/20 text-emerald-400 cursor-default"
                      : buttonDisabled(plan)
                        ? "bg-coral-500/50 text-white/60 cursor-not-allowed"
                        : "bg-coral-500 text-white hover:bg-coral-600"
                  }`}
                >
                  {buttonLabel(plan)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
