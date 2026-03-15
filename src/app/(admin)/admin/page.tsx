"use client";

import { useEffect, useState } from "react";

interface Stats {
  subscribers: {
    byTier: Record<string, number>;
    byStatus: Record<string, number>;
    totalActive: number;
  };
  credits: { granted: number; spent: number };
  lessonPlans: { total: number; published: number };
  recentSignups: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    subscription: { tier: string; status: string } | null;
  }[];
}

const tierLabels: Record<string, string> = {
  STARTER: "Starter",
  ESSENTIAL: "Essential",
  PRO_PLUS: "Pro+",
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setStats(data);
      })
      .catch(() => setError("Failed to load stats"));
  }, []);

  if (error) {
    return (
      <div className="rounded-lg bg-coral-950/50 p-4 text-sm text-coral-400">
        {error}
      </div>
    );
  }

  if (!stats) {
    return <p className="text-sm text-gray-500">Loading stats...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100">Overview</h1>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Subscribers" value={stats.subscribers.totalActive} />
        <StatCard label="Lesson Plans" value={stats.lessonPlans.total} sub={`${stats.lessonPlans.published} published`} />
        <StatCard label="Credits Granted" value={stats.credits.granted} />
        <StatCard label="Credits Spent" value={stats.credits.spent} />
      </div>

      {/* Tier breakdown */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-100">By Tier</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(["STARTER", "ESSENTIAL", "PRO_PLUS"] as const).map((tier) => (
            <div
              key={tier}
              className="rounded-lg border border-navy-800 bg-navy-900 p-4"
            >
              <p className="text-sm font-medium text-gray-400">
                {tierLabels[tier]}
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-100">
                {stats.subscribers.byTier[tier] ?? 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Status breakdown */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-100">By Status</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {Object.entries(stats.subscribers.byStatus).map(([status, count]) => (
            <div
              key={status}
              className="rounded-lg border border-navy-800 bg-navy-900 px-4 py-2"
            >
              <span className="text-sm text-gray-400">{status}</span>
              <span className="ml-2 font-semibold text-gray-100">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent signups */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-100">Recent Signups</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-navy-800 bg-navy-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy-800 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {stats.recentSignups.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-gray-100">
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{u.email}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {u.subscription
                      ? tierLabels[u.subscription.tier] ?? u.subscription.tier
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {stats.recentSignups.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-600"
                  >
                    No users yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-navy-800 bg-navy-900 p-5">
      <p className="text-sm font-medium text-gray-400">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-100">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}
