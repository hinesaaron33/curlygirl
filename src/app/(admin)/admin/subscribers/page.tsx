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
      <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>

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
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={tier}
          onChange={(e) => {
            setTier(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
          className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Credits</th>
              <th className="px-4 py-3">Subscribed Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  No subscribers found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3">
                    {u.subscription?.creditsBalance ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
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
          <p className="text-gray-500">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total}{" "}
            total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded border border-gray-300 px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pagination.totalPages}
              className="rounded border border-gray-300 px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
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
    ACTIVE: "bg-green-100 text-green-800",
    CANCELED: "bg-red-100 text-red-800",
    PAST_DUE: "bg-yellow-100 text-yellow-800",
    TRIALING: "bg-blue-100 text-blue-800",
    INACTIVE: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        colors[status] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}
