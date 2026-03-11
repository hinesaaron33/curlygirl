"use client";

import { useState } from "react";
import { createCustomerPortalSession } from "@/lib/stripe/actions";

export default function AccountPage() {
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { url } = await createCustomerPortalSession();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Failed to create portal session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Account</h1>
      <p className="mt-2 text-gray-600">
        Manage your account and subscription settings
      </p>

      <div className="mt-8">
        <button
          onClick={handleManageSubscription}
          disabled={loading}
          className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Manage Subscription"}
        </button>
      </div>
    </div>
  );
}
