"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CopiedPlan {
  id: string;
  copiedFileId: string;
  copiedAt: string;
  lessonPlan: {
    title: string;
    description: string | null;
    gradeLevel: string;
    topic: string;
    languageSkill: string;
    tags: string[];
  };
}

export default function MyPlansPage() {
  const [copies, setCopies] = useState<CopiedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/my-plans");
        if (!res.ok) throw new Error("Failed to load plans");
        const data = await res.json();
        setCopies(data.copies);
      } catch {
        setError("Could not load your plans. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-100">My Plans</h1>
        <p className="mt-1 text-sm text-white/60">
          Lesson plans you&apos;ve copied to your Google Drive
        </p>
        <div className="mt-8 text-sm text-white/60">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-100">My Plans</h1>
        <p className="mt-4 text-sm text-coral-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100">My Plans</h1>
      <p className="mt-1 text-sm text-white/60">
        Lesson plans you&apos;ve copied to your Google Drive
      </p>

      {copies.length === 0 ? (
        <div className="mt-8 rounded-lg border border-[#3a7f90] bg-[#418DA2] p-6 text-center">
          <p className="text-sm text-white/80">
            You haven&apos;t copied any lessons yet.
          </p>
          <Link
            href="/library"
            className="mt-4 inline-block rounded-lg bg-coral-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-coral-600"
          >
            Browse the Library
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {copies.map((copy) => (
            <div
              key={copy.id}
              className="rounded-lg border border-[#3a7f90] bg-[#418DA2] p-5"
            >
              <h3 className="text-lg font-semibold text-gray-100">
                {copy.lessonPlan.title}
              </h3>
              {copy.lessonPlan.description && (
                <p className="mt-1 text-sm text-white/70">
                  {copy.lessonPlan.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-coral-500/20 px-2.5 py-0.5 text-xs font-medium text-coral-400">
                  {copy.lessonPlan.gradeLevel}
                </span>
                <span className="rounded-full bg-[#84F1EC]/20 px-2.5 py-0.5 text-xs font-medium text-[#84F1EC]">
                  {copy.lessonPlan.topic}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                  {copy.lessonPlan.languageSkill}
                </span>
              </div>
              {copy.lessonPlan.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {copy.lessonPlan.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-3 text-xs text-white/40">
                Copied on{" "}
                {new Date(copy.copiedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <a
                href={`https://docs.google.com/file/d/${copy.copiedFileId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block w-full rounded-lg bg-coral-500 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-coral-600"
              >
                Open in Google Drive
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
