"use client";

import { useEffect, useState } from "react";

interface Stats {
  subscribers: {
    byTier: Record<string, number>;
    byStatus: Record<string, number>;
    totalActive: number;
    newLast7: number;
    newLast30: number;
    canceledByTier: Record<string, number>;
  };
  credits: { granted: number; spent: number };
  revenueThisMonth: number;
  recentSignups: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    subscription: { tier: string; status: string; billingInterval: string | null } | null;
  }[];
}

const tierLabels: Record<string, string> = {
  STARTER: "Starter",
  ESSENTIAL: "Essential",
  PRO_PLUS: "Pro+",
};

const tabs = ["Overview", "Subscribers", "Recent Signups"] as const;
type Tab = (typeof tabs)[number];

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

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
    return <p className="text-sm text-white/60">Loading stats...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100">Overview</h1>

      {/* Tabs */}
      <div className="relative mt-6">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#84F1EC]/40" />
        <nav className="relative flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative rounded-t-lg px-4 py-2 text-base font-medium transition-colors ${
                activeTab === tab
                  ? "border-3 border-[#84F1EC] border-b-transparent bg-admin-sidebar text-white"
                  : "border border-transparent text-white/60 hover:border-gold hover:border-b-transparent hover:text-white/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "Overview" && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button
                onClick={() => setActiveTab("Subscribers")}
                className="rounded-lg border border-[#3a7f90] bg-[#418DA2] p-5 text-center transition-colors hover:border-gold cursor-pointer"
              >
                <p className="text-sm font-medium text-white/80">Active Subscribers</p>
                <p className="mt-1 text-3xl font-bold text-gray-100">{stats.subscribers.totalActive}</p>
                <div className="mt-3 flex justify-center gap-4 border-t border-white/20 pt-3">
                  {(["STARTER", "ESSENTIAL", "PRO_PLUS"] as const).map((tier) => (
                    <div key={tier} className="text-center">
                      <p className="text-xs text-white/60">{tierLabels[tier]}</p>
                      <p className="text-lg font-semibold text-gray-100">{stats.subscribers.byTier[tier] ?? 0}</p>
                    </div>
                  ))}
                </div>
              </button>
              <StatCard label="Revenue this Month" value={`$${stats.revenueThisMonth.toFixed(2)}`} />
              <StatCard label="Credits Granted" value={stats.credits.granted} />
              <StatCard label="Credits Spent" value={stats.credits.spent} />
            </div>
          </>
        )}

        {activeTab === "Subscribers" && (
          <>
            {/* Active Subscribers + New Subscribers */}
            <div className="flex gap-5">
              <div className="rounded-xl border border-[#3a7f90] bg-[#418DA2] p-7 text-center">
                <p className="text-base font-medium text-white/80">Active Subscribers</p>
                <p className="mt-2 text-4xl font-bold text-gray-100">{stats.subscribers.totalActive}</p>
                <div className="mt-4 flex justify-center gap-6 border-t border-white/20 pt-4">
                  {(["STARTER", "ESSENTIAL", "PRO_PLUS"] as const).map((tier) => (
                    <div key={tier} className="text-center">
                      <p className="text-sm text-white/60">{tierLabels[tier]}</p>
                      <p className="text-xl font-semibold text-gray-100">{stats.subscribers.byTier[tier] ?? 0}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#3a7f90] bg-[#418DA2] p-7 text-center">
                <p className="text-base font-medium text-white/80">New Subscribers</p>
                <div className="mt-4 flex justify-center gap-8 border-t border-white/20 pt-4">
                  <div className="text-center">
                    <p className="text-sm text-white/60">Last 7 Days</p>
                    <p className="mt-1 text-3xl font-bold text-gray-100">{stats.subscribers.newLast7}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white/60">Last 30 Days</p>
                    <p className="mt-1 text-3xl font-bold text-gray-100">{stats.subscribers.newLast30}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#3a7f90] bg-[#418DA2] p-7 text-center">
                <p className="text-base font-medium text-white/80">Lost Subscribers</p>
                <p className="mt-2 text-4xl font-bold text-gray-100">
                  {(["STARTER", "ESSENTIAL", "PRO_PLUS"] as const).reduce(
                    (sum, t) => sum + (stats.subscribers.canceledByTier[t] ?? 0), 0
                  )}
                </p>
                <div className="mt-4 flex justify-center gap-6 border-t border-white/20 pt-4">
                  {(["STARTER", "ESSENTIAL", "PRO_PLUS"] as const).map((tier) => (
                    <div key={tier} className="text-center">
                      <p className="text-sm text-white/60">{tierLabels[tier]}</p>
                      <p className="text-xl font-semibold text-gray-100">{stats.subscribers.canceledByTier[tier] ?? 0}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* By Status */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-100">By Status</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {Object.entries(stats.subscribers.byStatus).map(([status, count]) => (
                  <div
                    key={status}
                    className="rounded-lg border border-[#3a7f90] bg-[#418DA2] px-4 py-2"
                  >
                    <span className="text-sm text-white/80">{status}</span>
                    <span className="ml-2 font-semibold text-gray-100">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "Recent Signups" && (
          <div className="overflow-x-auto rounded-lg border border-[#3a7f90] bg-[#418DA2]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/20 text-xs uppercase text-white/60">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Billing</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {stats.recentSignups.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium text-gray-100">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 text-white/80">{u.email}</td>
                    <td className="px-4 py-3 text-white/90">
                      {u.subscription
                        ? tierLabels[u.subscription.tier] ?? u.subscription.tier
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-white/90 capitalize">
                      {u.subscription?.billingInterval ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-white/80">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {stats.recentSignups.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-white/50"
                    >
                      No users yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
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
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-[#3a7f90] bg-[#418DA2] p-5 text-center">
      <p className="text-sm font-medium text-white/80">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-100">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/60">{sub}</p>}
    </div>
  );
}
