"use client";

import { useEffect, useState, useCallback } from "react";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  subscription: {
    tier: string;
    status: string;
    creditsBalance: number;
    canceledAt: string | null;
    createdAt: string;
  } | null;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const tierLabels: Record<string, string> = {
  STARTER: "Starter",
  ESSENTIAL: "Essential",
  PRO_PLUS: "Pro+",
};

export default function SubscriberManagementPage() {
  const [users, setUsers] = useState<Subscriber[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (tier) params.set("tier", tier);
    if (status) params.set("status", status);
    params.set("page", String(page));

    const res = await fetch(`/api/admin/subscribers?${params}`);
    const data = await res.json();
    setUsers(data.users ?? []);
    setPagination(data.pagination ?? null);
    setLoading(false);
  }, [search, tier, status, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100">Subscribers</h1>

      {/* Filters */}
      <form
        onSubmit={handleSearch}
        className="mt-4 flex flex-wrap items-end gap-3"
      >
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-navy-700 bg-[#418DA2] px-3 py-2 text-sm text-gray-200 placeholder:text-white/60 focus:border-coral-500 focus:outline-none focus:ring-1 focus:ring-coral-500"
        />
        <select
          value={tier}
          onChange={(e) => {
            setTier(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-navy-700 bg-[#418DA2] px-3 py-2 text-sm text-gray-200"
        >
          <option value="">All Tiers</option>
          <option value="STARTER">Starter</option>
          <option value="ESSENTIAL">Essential</option>
          <option value="PRO_PLUS">Pro+</option>
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-navy-700 bg-[#418DA2] px-3 py-2 text-sm text-gray-200"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="CANCELED">Canceled</option>
          <option value="PAST_DUE">Past Due</option>
          <option value="TRIALING">Trialing</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-[#3a7f90] bg-[#418DA2]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy-800 text-xs uppercase text-white/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Credits</th>
              <th className="px-4 py-3">Subscribed Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-white/50">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-white/50">
                  No subscribers found
                </td>
              </tr>
            ) : (
              users.map((u) => (
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
                  <td className="px-4 py-3">
                    {u.subscription ? (
                      <StatusBadge status={u.subscription.status} />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/90">
                    {u.subscription?.creditsBalance ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {u.subscription
                      ? new Date(u.subscription.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-white/60">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total}{" "}
            total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded border border-navy-700 px-3 py-1 text-white/80 hover:bg-[#418DA2] disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pagination.totalPages}
              className="rounded border border-navy-700 px-3 py-1 text-white/80 hover:bg-[#418DA2] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: "bg-green-950 text-green-400",
    CANCELED: "bg-coral-950 text-coral-400",
    PAST_DUE: "bg-yellow-950 text-yellow-400",
    TRIALING: "bg-blue-950 text-blue-400",
    INACTIVE: "bg-[#418DA2] text-white/80",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        colors[status] ?? "bg-[#418DA2] text-white/80"
      }`}
    >
      {status}
    </span>
  );
}
