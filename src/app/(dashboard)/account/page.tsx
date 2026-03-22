"use client";

import { useEffect, useState } from "react";
import { createCustomerPortalSession } from "@/lib/stripe/actions";

interface AccountData {
  user: {
    name: string;
    email: string;
    googleEmail: string | null;
    googleConnected: boolean;
  };
  subscription: {
    tier: string;
    status: string;
    creditsBalance: number;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
}

const tierColors: Record<string, string> = {
  STARTER: "bg-emerald-500/20 text-emerald-400",
  ESSENTIAL: "bg-[#84F1EC]/20 text-[#84F1EC]",
  PRO_PLUS: "bg-coral-500/20 text-coral-400",
};

const tierLabels: Record<string, string> = {
  STARTER: "Starter",
  ESSENTIAL: "Essential",
  PRO_PLUS: "Pro+",
};

const statusConfig: Record<string, { color: string; label: string }> = {
  ACTIVE: { color: "bg-emerald-500", label: "Active" },
  CANCELED: { color: "bg-coral-500", label: "Canceled" },
  PAST_DUE: { color: "bg-amber-500", label: "Past Due" },
  TRIALING: { color: "bg-[#84F1EC]", label: "Trialing" },
  INACTIVE: { color: "bg-white/30", label: "Inactive" },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AccountPage() {
  const [portalLoading, setPortalLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AccountData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/account");
        if (res.ok) {
          setData(await res.json());
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { url } = await createCustomerPortalSession();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Failed to create portal session:", error);
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Account</h1>
        <p className="mt-1 text-sm text-white/60">
          Manage your account and subscription settings
        </p>
        <div className="mt-8 text-sm text-white/60">Loading...</div>
      </div>
    );
  }

  const sub = data?.subscription;
  const user = data?.user;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100">Account</h1>
      <p className="mt-1 text-sm text-white/60">
        Manage your account and subscription settings
      </p>

      <div className="mt-8 space-y-6">
        {/* Subscription Details */}
        <div className="rounded-lg border border-[#3a7f90] bg-[#418DA2] p-5">
          <h2 className="text-lg font-semibold text-gray-100">
            Subscription Details
          </h2>
          {sub ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60">Plan:</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tierColors[sub.tier] || "bg-white/10 text-white/80"}`}
                >
                  {tierLabels[sub.tier] || sub.tier}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60">Status:</span>
                <span className="flex items-center gap-1.5 text-sm text-gray-100">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${statusConfig[sub.status]?.color || "bg-white/30"}`}
                  />
                  {statusConfig[sub.status]?.label || sub.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60">
                  Credits remaining:
                </span>
                <span className="text-sm font-bold text-gray-100">
                  {sub.creditsBalance}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60">Billing period:</span>
                <span className="text-sm text-gray-100">
                  {formatDate(sub.currentPeriodStart)} —{" "}
                  {formatDate(sub.currentPeriodEnd)}
                </span>
              </div>
              {sub.cancelAtPeriodEnd && (
                <p className="text-sm text-coral-400">
                  Your subscription will cancel at the end of the current period.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-white/60">No active subscription.</p>
              <a
                href="/#pricing"
                className="mt-3 inline-block rounded-lg bg-coral-500 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600"
              >
                View Plans
              </a>
            </div>
          )}
        </div>

        {/* Google Drive */}
        <div className="rounded-lg border border-[#3a7f90] bg-[#418DA2] p-5">
          <h2 className="text-lg font-semibold text-gray-100">Google Drive</h2>
          <div className="mt-4">
            {user?.googleConnected ? (
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-gray-100">
                  Connected as {user.googleEmail}
                </span>
                <a
                  href="/api/auth/google"
                  className="ml-auto text-sm text-[#84F1EC] hover:underline"
                >
                  Reconnect
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60">Not connected</span>
                <a
                  href="/api/auth/google"
                  className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600"
                >
                  Connect Google Drive
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Manage Subscription */}
        {sub && (
          <div className="rounded-lg border border-[#3a7f90] bg-[#418DA2] p-5">
            <h2 className="text-lg font-semibold text-gray-100">
              Manage Subscription
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Update your payment method, change plans, or cancel.
            </p>
            <button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="mt-4 rounded-lg bg-coral-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-coral-600 disabled:opacity-50"
            >
              {portalLoading ? "Loading..." : "Manage Subscription"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
