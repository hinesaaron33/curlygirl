"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface LessonPlan {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string;
  topic: string;
  languageSkill: string;
  tags: string[];
  googleDriveUrl: string | null;
}

export default function LibraryPage() {
  const searchParams = useSearchParams();
  const googleStatus = searchParams.get("google");

  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (googleStatus === "connected") {
      setGoogleConnected(true);
      setMessage("Google Drive connected successfully!");
    } else if (googleStatus === "error") {
      setMessage("Failed to connect Google Drive. Please try again.");
    }
  }, [googleStatus]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/library");
        if (res.ok) {
          const data = await res.json();
          setPlans(data.plans);
          setGoogleConnected(data.googleConnected);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleCopy(planId: string) {
    setCopyingId(planId);
    setMessage("");
    try {
      const res = await fetch("/api/drive/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonPlanId: planId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Lesson plan copied to your Google Drive!");
        window.open(data.url, "_blank");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } finally {
      setCopyingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Library</h1>
          <p className="mt-2 text-gray-600">
            Browse and get lesson plans copied to your Google Drive
          </p>
        </div>
        {!googleConnected && (
          <a
            href="/api/auth/google"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Connect Google Drive
          </a>
        )}
      </div>

      {message && (
        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
          {message}
        </div>
      )}

      {!googleConnected && (
        <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">
            Connect your Google Drive to get lesson plans copied directly to
            your account.
          </p>
          <a
            href="/api/auth/google"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Connect Google Drive
          </a>
        </div>
      )}

      {loading ? (
        <div className="mt-8 text-center text-gray-500">Loading lesson plans…</div>
      ) : plans.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">
          No lesson plans available yet.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {plan.title}
              </h3>
              {plan.description && (
                <p className="mt-1 text-sm text-gray-600">{plan.description}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-700">
                  {plan.gradeLevel}
                </span>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {plan.topic}
                </span>
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  {plan.languageSkill}
                </span>
              </div>
              {plan.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {plan.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4">
                {googleConnected ? (
                  <button
                    onClick={() => handleCopy(plan.id)}
                    disabled={copyingId === plan.id}
                    className="w-full rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50"
                  >
                    {copyingId === plan.id
                      ? "Copying…"
                      : "Get this lesson"}
                  </button>
                ) : (
                  <a
                    href="/api/auth/google"
                    className="block w-full rounded-lg bg-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-300"
                  >
                    Connect Google Drive first
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
