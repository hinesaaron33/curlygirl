"use client";

import { useEffect, useState, useCallback } from "react";

interface Bundle {
  id: string;
  name: string;
  tier: string;
  description: string | null;
  _count: { lessonPlans: number };
}

interface LessonPlan {
  id: string;
  title: string;
  gradeLevel: string;
  topic: string;
  published: boolean;
}

const tierLabels: Record<string, string> = {
  STARTER: "Starter",
  ESSENTIAL: "Essential",
  PRO_PLUS: "Pro+",
};

export default function BundleManagementPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bundleLessons, setBundleLessons] = useState<LessonPlan[]>([]);
  const [allLessons, setAllLessons] = useState<LessonPlan[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTier, setNewTier] = useState("STARTER");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  const fetchBundles = useCallback(async () => {
    const res = await fetch("/api/admin/bundles");
    const data = await res.json();
    setBundles(data.bundles ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName) return;
    setCreating(true);
    const res = await fetch("/api/admin/bundles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        tier: newTier,
        description: newDesc || undefined,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setBundles((prev) => [...prev, data.bundle]);
      setNewName("");
      setNewDesc("");
      setShowCreate(false);
      setMessage(`Bundle "${data.bundle.name}" created`);
    } else {
      setMessage(`Error: ${data.error}`);
    }
    setCreating(false);
  }

  async function expandBundle(bundleId: string) {
    if (expandedId === bundleId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(bundleId);
    setLessonsLoading(true);

    const [lessonsRes] = await Promise.all([
      fetch(`/api/admin/bundles/${bundleId}/lessons`),
      allLessons.length > 0
        ? Promise.resolve(null)
        : fetch("/api/admin/stats").then(() =>
            fetch(`/api/admin/bundles/${bundleId}/lessons`)
          ),
    ]);

    const lessonsData = await lessonsRes.json();
    setBundleLessons(lessonsData.lessons ?? []);

    if (allLessons.length === 0) {
      const lpRes = await fetch("/api/admin/lessons");
      if (lpRes.ok) {
        const lpData = await lpRes.json();
        setAllLessons(lpData.lessons ?? []);
      }
    }

    setLessonsLoading(false);
  }

  async function addLesson(bundleId: string, lessonPlanId: string) {
    const res = await fetch(`/api/admin/bundles/${bundleId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonPlanId }),
    });
    if (res.ok) {
      const updated = await fetch(`/api/admin/bundles/${bundleId}/lessons`);
      const data = await updated.json();
      setBundleLessons(data.lessons ?? []);
      setBundles((prev) =>
        prev.map((b) =>
          b.id === bundleId
            ? { ...b, _count: { lessonPlans: b._count.lessonPlans + 1 } }
            : b
        )
      );
    }
  }

  async function removeLesson(bundleId: string, lessonPlanId: string) {
    const res = await fetch(`/api/admin/bundles/${bundleId}/lessons`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonPlanId }),
    });
    if (res.ok) {
      setBundleLessons((prev) => prev.filter((l) => l.id !== lessonPlanId));
      setBundles((prev) =>
        prev.map((b) =>
          b.id === bundleId
            ? { ...b, _count: { lessonPlans: Math.max(0, b._count.lessonPlans - 1) } }
            : b
        )
      );
    }
  }

  // Group bundles by tier
  const grouped: Record<string, Bundle[]> = {};
  for (const b of bundles) {
    if (!grouped[b.tier]) grouped[b.tier] = [];
    grouped[b.tier].push(b);
  }

  const bundleLessonIds = new Set(bundleLessons.map((l) => l.id));
  const availableLessons = allLessons.filter((l) => !bundleLessonIds.has(l.id));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Bundles</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600"
        >
          {showCreate ? "Cancel" : "Create Bundle"}
        </button>
      </div>

      {message && (
        <div className="mt-3 rounded-lg bg-blue-950/50 p-3 text-sm text-blue-400">
          {message}
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mt-4 rounded-lg border border-navy-800 bg-navy-900 p-4"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Bundle name *"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="rounded-lg border border-navy-700 bg-navy-800 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500"
              required
            />
            <select
              value={newTier}
              onChange={(e) => setNewTier(e.target.value)}
              className="rounded-lg border border-navy-700 bg-navy-800 px-3 py-2 text-sm text-gray-200"
            >
              <option value="STARTER">Starter</option>
              <option value="ESSENTIAL">Essential</option>
              <option value="PRO_PLUS">Pro+</option>
            </select>
            <input
              type="text"
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="rounded-lg border border-navy-700 bg-navy-800 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={creating || !newName}
            className="mt-3 rounded-lg bg-coral-500 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      {/* Bundle list */}
      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading bundles...</p>
      ) : bundles.length === 0 ? (
        <p className="mt-6 text-sm text-gray-600">No bundles yet</p>
      ) : (
        (["STARTER", "ESSENTIAL", "PRO_PLUS"] as const).map((tier) =>
          grouped[tier] && grouped[tier].length > 0 ? (
            <div key={tier} className="mt-8">
              <h2 className="text-lg font-semibold text-gray-100">
                {tierLabels[tier]}
              </h2>
              <div className="mt-3 space-y-2">
                {grouped[tier].map((bundle) => (
                  <div
                    key={bundle.id}
                    className="rounded-lg border border-navy-800 bg-navy-900"
                  >
                    <button
                      onClick={() => expandBundle(bundle.id)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left"
                    >
                      <div>
                        <span className="font-medium text-gray-100">
                          {bundle.name}
                        </span>
                        {bundle.description && (
                          <span className="ml-2 text-sm text-gray-500">
                            — {bundle.description}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {bundle._count.lessonPlans} lesson
                        {bundle._count.lessonPlans !== 1 ? "s" : ""}
                      </span>
                    </button>

                    {expandedId === bundle.id && (
                      <div className="border-t border-navy-800 px-4 py-3">
                        {lessonsLoading ? (
                          <p className="text-sm text-gray-500">Loading...</p>
                        ) : (
                          <>
                            {bundleLessons.length > 0 ? (
                              <ul className="space-y-1">
                                {bundleLessons.map((lp) => (
                                  <li
                                    key={lp.id}
                                    className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-navy-800"
                                  >
                                    <span className="text-gray-300">
                                      {lp.title}{" "}
                                      <span className="text-gray-500">
                                        ({lp.gradeLevel} / {lp.topic})
                                      </span>
                                    </span>
                                    <button
                                      onClick={() =>
                                        removeLesson(bundle.id, lp.id)
                                      }
                                      className="text-xs text-coral-400 hover:text-coral-300"
                                    >
                                      Remove
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-600">
                                No lessons in this bundle
                              </p>
                            )}

                            {/* Add lesson */}
                            {availableLessons.length > 0 && (
                              <div className="mt-3 flex items-center gap-2">
                                <select
                                  id={`add-${bundle.id}`}
                                  className="flex-1 rounded border border-navy-700 bg-navy-800 px-2 py-1.5 text-sm text-gray-200"
                                  defaultValue=""
                                >
                                  <option value="" disabled>
                                    Add a lesson...
                                  </option>
                                  {availableLessons.map((lp) => (
                                    <option key={lp.id} value={lp.id}>
                                      {lp.title} ({lp.gradeLevel})
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => {
                                    const sel = document.getElementById(
                                      `add-${bundle.id}`
                                    ) as HTMLSelectElement;
                                    if (sel?.value) addLesson(bundle.id, sel.value);
                                  }}
                                  className="rounded bg-coral-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-coral-600"
                                >
                                  Add
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )
      )}
    </div>
  );
}
