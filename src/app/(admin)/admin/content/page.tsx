"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FolderIcon } from "@heroicons/react/24/outline";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  modifiedTime: string;
  webViewLink?: string;
}

interface LinkFormData {
  title: string;
  description: string;
  gradeLevel: string;
  topic: string;
  languageSkill: string;
  tags: string;
}

interface SyncRow {
  tabName: string;
  productTitle: string;
  driveLink: string | null;
  driveFileId: string | null;
  tptLink: string | null;
  price: string | null;
  resourceType: string | null;
  slifeReady: boolean | null;
  resourceCount: string | null;
  pageSlideCount: string | null;
  theme: string | null;
  resourceUpdate: string | null;
  coverPreviewUpdate: string | null;
  bundleNames: string[];
  status: "matched" | "pending" | "no_drive_link";
  lessonPlanId?: string;
}

export default function ContentManagementPage() {
  return (
    <Suspense fallback={<div className="text-white/80">Loading...</div>}>
      <ContentManagementContent />
    </Suspense>
  );
}

interface LessonPlanRow {
  id: string;
  title: string;
  gradeLevel: string;
  topic: string;
  published: boolean;
}

type TabView = "lessons" | "drive" | "sheet";

function ContentManagementContent() {
  const [activeTab, setActiveTab] = useState<TabView>("lessons");

  // Lesson plans state
  const [lessonPlans, setLessonPlans] = useState<LessonPlanRow[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  // Drive state
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [formData, setFormData] = useState<LinkFormData>({
    title: "",
    description: "",
    gradeLevel: "",
    topic: "",
    languageSkill: "",
    tags: "",
  });
  const [linking, setLinking] = useState(false);
  const [message, setMessage] = useState("");
  const [connectUrl, setConnectUrl] = useState<string | null>(null);
  const [folderId, setFolderId] = useState<string | null>(null);

  // Sheet sync state
  const [syncRows, setSyncRows] = useState<SyncRow[]>([]);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [selectedPending, setSelectedPending] = useState<Set<number>>(
    new Set()
  );
  const [importing, setImporting] = useState(false);

  async function browseDrive(pageToken?: string) {
    setLoading(true);
    setConnectUrl(null);
    setMessage("");
    try {
      const params = new URLSearchParams();
      if (pageToken) params.set("pageToken", pageToken);
      const res = await fetch(`/api/admin/drive/browse?${params}`);
      const data = await res.json();
      if (res.ok) {
        setFiles(pageToken ? [...files, ...data.files] : data.files);
        setNextPageToken(data.nextPageToken);
        if (data.folderId) setFolderId(data.folderId);
      } else if (data.connectUrl) {
        setConnectUrl(data.connectUrl);
        setMessage(
          "Google Drive not connected. Connect your account to browse files."
        );
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage(
        `Error: ${err instanceof Error ? err.message : "Failed to fetch"}`
      );
    } finally {
      setLoading(false);
    }
  }

  async function fetchLessonPlans() {
    setLessonsLoading(true);
    try {
      const res = await fetch("/api/admin/lessons");
      const data = await res.json();
      if (res.ok) {
        setLessonPlans(data.lessons);
      }
    } catch {
      // silently fail
    } finally {
      setLessonsLoading(false);
    }
  }

  function openLinkModal(file: DriveFile) {
    setSelectedFile(file);
    setFormData({
      title: file.name.replace(/\.[^.]+$/, ""),
      description: "",
      gradeLevel: "",
      topic: "",
      languageSkill: "",
      tags: "",
    });
    setMessage("");
  }

  async function handleLink() {
    if (!selectedFile) return;
    setLinking(true);
    try {
      const res = await fetch("/api/admin/drive/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driveFileId: selectedFile.id,
          driveUrl: selectedFile.webViewLink,
          title: formData.title,
          description: formData.description || undefined,
          gradeLevel: formData.gradeLevel,
          topic: formData.topic,
          languageSkill: formData.languageSkill,
          tags: formData.tags
            ? formData.tags.split(",").map((t) => t.trim())
            : [],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Linked "${formData.title}" successfully!`);
        setSelectedFile(null);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } finally {
      setLinking(false);
    }
  }

  // Sheet sync functions
  async function syncFromSheet() {
    setSyncLoading(true);
    setSyncMessage("");
    setSelectedPending(new Set());
    try {
      const res = await fetch("/api/admin/sheets/sync");
      const data = await res.json();
      if (res.ok) {
        setSyncRows(data.rows);
        setActiveTab("sheet");
        const pending = data.rows.filter(
          (r: SyncRow) => r.status === "pending"
        ).length;
        const matched = data.rows.filter(
          (r: SyncRow) => r.status === "matched"
        ).length;
        setSyncMessage(
          `Found ${data.rows.length} rows: ${pending} pending, ${matched} matched`
        );
      } else if (data.connectUrl) {
        setConnectUrl(data.connectUrl);
        setSyncMessage(
          "Google account not connected. Connect to sync from sheet."
        );
      } else {
        setSyncMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setSyncMessage(
        `Error: ${err instanceof Error ? err.message : "Failed to fetch"}`
      );
    } finally {
      setSyncLoading(false);
    }
  }

  function togglePending(index: number) {
    setSelectedPending((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function selectAllPending() {
    const pendingIndices = syncRows
      .map((r, i) => (r.status === "pending" ? i : -1))
      .filter((i) => i !== -1);
    setSelectedPending(new Set(pendingIndices));
  }

  async function importSelected() {
    const rows = syncRows.filter(
      (_, i) => selectedPending.has(i) && syncRows[i].status === "pending"
    );
    if (!rows.length) return;

    setImporting(true);
    setSyncMessage("");
    try {
      const res = await fetch("/api/admin/sheets/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      if (res.ok) {
        setSyncMessage(data.message);
        // Refresh to update statuses
        await syncFromSheet();
      } else {
        setSyncMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setSyncMessage(
        `Error: ${err instanceof Error ? err.message : "Import failed"}`
      );
    } finally {
      setImporting(false);
    }
  }

  const searchParams = useSearchParams();

  useEffect(() => {
    const googleStatus = searchParams.get("google");
    if (googleStatus === "connected") {
      setMessage("Google Drive connected successfully!");
    } else if (googleStatus === "error") {
      setMessage("Failed to connect Google Drive. Please try again.");
    }
    fetchLessonPlans();
    browseDrive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputClass =
    "w-full rounded-lg border border-navy-700 bg-[#418DA2] px-3 py-2 text-sm text-gray-200 placeholder:text-white/60 focus:border-coral-500 focus:outline-none focus:ring-1 focus:ring-coral-500";

  const pendingRows = syncRows.filter((r) => r.status === "pending");
  const matchedRows = syncRows.filter((r) => r.status === "matched");
  const noDriveLinkRows = syncRows.filter(
    (r) => r.status === "no_drive_link"
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">
            Library
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Manage lesson plans, browse Google Drive, and sync from sheets
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={syncFromSheet}
            disabled={syncLoading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {syncLoading ? "Syncing..." : "Sync from Sheet"}
          </button>
          <button
            onClick={() => {
              setActiveTab("drive");
              browseDrive();
            }}
            disabled={loading}
            className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Browse Drive"}
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="relative mt-6">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#84F1EC]/40" />
        <nav className="relative flex gap-1">
          <button
            onClick={() => setActiveTab("lessons")}
            className={`relative rounded-t-lg px-4 py-2 text-base font-medium transition-colors ${
              activeTab === "lessons"
                ? "border-3 border-[#84F1EC] border-b-transparent bg-admin-sidebar text-white"
                : "border border-transparent text-white/60 hover:border-gold hover:border-b-transparent hover:text-white/80"
            }`}
          >
            Lesson Plans
            {lessonPlans.length > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                {lessonPlans.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("drive")}
            className={`relative rounded-t-lg px-4 py-2 text-base font-medium transition-colors ${
              activeTab === "drive"
                ? "border-3 border-[#84F1EC] border-b-transparent bg-admin-sidebar text-white"
                : "border border-transparent text-white/60 hover:border-gold hover:border-b-transparent hover:text-white/80"
            }`}
          >
            Drive Files
          </button>
          <button
            onClick={() => setActiveTab("sheet")}
            className={`relative rounded-t-lg px-4 py-2 text-base font-medium transition-colors ${
              activeTab === "sheet"
                ? "border-3 border-[#84F1EC] border-b-transparent bg-admin-sidebar text-white"
                : "border border-transparent text-white/60 hover:border-gold hover:border-b-transparent hover:text-white/80"
            }`}
          >
            Sheet Sync
            {pendingRows.length > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                {pendingRows.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* ─── Lesson Plans Tab ─── */}
      {activeTab === "lessons" && (
        <div className="mt-6">
          {lessonsLoading && (
            <div className="text-sm text-white/80">Loading lesson plans...</div>
          )}

          {!lessonsLoading && lessonPlans.length === 0 && (
            <div className="rounded-lg border border-navy-700 bg-[#418DA2] p-6 text-center">
              <p className="text-sm text-white/90">
                No lesson plans yet. Import them via the Drive Files or Sheet Sync tabs.
              </p>
            </div>
          )}

          {lessonPlans.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-navy-700">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#3a7f90] text-xs uppercase text-white/80">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Grade Level</th>
                    <th className="px-4 py-3">Topic</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-700">
                  {lessonPlans.map((lp) => (
                    <tr key={lp.id} className="bg-[#418DA2] hover:bg-[#3a7f90]/60">
                      <td className="px-4 py-3 font-medium text-gray-100">{lp.title}</td>
                      <td className="px-4 py-3 text-white/80">{lp.gradeLevel}</td>
                      <td className="px-4 py-3 text-white/80">{lp.topic}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          lp.published
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {lp.published ? "Published" : "Draft"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── Drive Tab ─── */}
      {activeTab === "drive" && (
        <>
          {loading && !files.length && (
            <div className="mt-6 text-sm text-white/80">
              Loading files from Google Drive...
            </div>
          )}

          {message && (
            <div className="mt-4 rounded-lg border border-navy-700 bg-[#418DA2] p-4 text-sm text-white/90">
              <p>{message}</p>
              {connectUrl && (
                <a
                  href={connectUrl}
                  className="mt-3 inline-block rounded-lg bg-coral-500 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600"
                >
                  Connect Google Drive
                </a>
              )}
            </div>
          )}

          {!loading && !message && files.length === 0 && (
            <div className="mt-6 rounded-lg border border-navy-700 bg-[#418DA2] p-6 text-center">
              <p className="text-sm text-white/90">
                No files found in the linked Google Drive folder.
              </p>
              {folderId && (
                <p className="mt-2 text-xs text-white/60">
                  Folder:{" "}
                  <a
                    href={`https://drive.google.com/drive/folders/${folderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coral-400 underline hover:text-coral-300"
                  >
                    Open in Google Drive
                  </a>
                </p>
              )}
              <p className="mt-1 text-xs text-white/60">
                Add lesson plan files to this folder, then click &quot;Browse
                Drive&quot; to refresh.
              </p>
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="rounded-lg border border-[#3a7f90] bg-[#418DA2] p-4"
                >
                  {file.thumbnailLink && (
                    <img
                      src={file.thumbnailLink}
                      alt={file.name}
                      className="mb-3 h-32 w-full rounded object-cover"
                    />
                  )}
                  <h3 className="truncate text-sm font-medium text-gray-100">
                    {file.name}
                  </h3>
                  <p className="mt-1 text-xs text-white/60">
                    {new Date(file.modifiedTime).toLocaleDateString()}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => openLinkModal(file)}
                      className="rounded bg-coral-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-coral-600"
                    >
                      Link to lesson plan
                    </button>
                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 transition-colors hover:text-white"
                        title="Open in Google Drive"
                      >
                        <FolderIcon className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {nextPageToken && (
            <div className="mt-4 text-center">
              <button
                onClick={() => browseDrive(nextPageToken)}
                disabled={loading}
                className="text-sm font-medium text-coral-400 hover:text-coral-300"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}

      {/* ─── Sheet Sync Tab ─── */}
      {activeTab === "sheet" && (
        <div className="mt-6">
          {syncMessage && (
            <div className="mb-4 rounded-lg border border-navy-700 bg-[#418DA2] p-3 text-sm text-white/90">
              {syncMessage}
              {connectUrl && (
                <a
                  href={connectUrl}
                  className="ml-3 inline-block rounded bg-coral-500 px-3 py-1 text-xs font-medium text-white hover:bg-coral-600"
                >
                  Connect Google
                </a>
              )}
            </div>
          )}

          {syncRows.length === 0 && !syncLoading && (
            <div className="rounded-lg border border-navy-700 bg-[#418DA2] p-6 text-center">
              <p className="text-sm text-white/90">
                Click &quot;Sync from Sheet&quot; to fetch lesson plan data from
                the Google Sheet.
              </p>
            </div>
          )}

          {/* Pending section */}
          {pendingRows.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-100">
                  <span className="inline-block h-3 w-3 rounded-full bg-amber-500" />
                  Pending Import ({pendingRows.length})
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllPending}
                    className="rounded border border-navy-700 px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-[#418DA2]"
                  >
                    Select All
                  </button>
                  <button
                    onClick={importSelected}
                    disabled={importing || selectedPending.size === 0}
                    className="rounded bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50"
                  >
                    {importing
                      ? "Importing..."
                      : `Import Selected (${selectedPending.size})`}
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {syncRows.map(
                  (row, i) =>
                    row.status === "pending" && (
                      <div
                        key={i}
                        className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                          selectedPending.has(i)
                            ? "border-amber-500/50 bg-amber-500/10"
                            : "border-navy-700 bg-[#418DA2]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPending.has(i)}
                          onChange={() => togglePending(i)}
                          className="h-4 w-4 rounded border-navy-600 bg-[#418DA2] text-amber-500 focus:ring-amber-500"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-100">
                            {row.productTitle}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-white/80">
                            <span className="rounded bg-[#418DA2] px-1.5 py-0.5">
                              {row.tabName}
                            </span>
                            {row.resourceType && (
                              <span className="rounded bg-[#418DA2] px-1.5 py-0.5">
                                {row.resourceType}
                              </span>
                            )}
                            {row.price && (
                              <span className="rounded bg-[#418DA2] px-1.5 py-0.5">
                                {row.price}
                              </span>
                            )}
                            {row.theme && (
                              <span className="rounded bg-[#418DA2] px-1.5 py-0.5">
                                {row.theme}
                              </span>
                            )}
                            {row.bundleNames.length > 0 && (
                              <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-indigo-300">
                                {row.bundleNames.join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* Matched section */}
          {matchedRows.length > 0 && (
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-100">
                <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
                Already Imported ({matchedRows.length})
              </h2>
              <div className="mt-3 space-y-2">
                {syncRows.map(
                  (row, i) =>
                    row.status === "matched" && (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-lg border border-navy-700 bg-[#418DA2] p-3"
                      >
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-100">
                            {row.productTitle}
                          </p>
                          <p className="text-xs text-white/60">
                            {row.tabName}
                            {row.lessonPlanId && (
                              <span className="ml-2 text-emerald-400">
                                ID: {row.lessonPlanId}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* No drive link section */}
          {noDriveLinkRows.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-100">
                <span className="inline-block h-3 w-3 rounded-full bg-gray-500" />
                No Drive Link ({noDriveLinkRows.length})
              </h2>
              <div className="mt-3 space-y-2">
                {syncRows.map(
                  (row, i) =>
                    row.status === "no_drive_link" && (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-lg border border-[#3a7f90] bg-[#418DA2]/50 p-3"
                      >
                        <span className="inline-block h-2 w-2 rounded-full bg-gray-600" />
                        <p className="truncate text-sm text-white/60">
                          {row.productTitle}
                          <span className="ml-2 text-xs">({row.tabName})</span>
                        </p>
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Link modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-lg rounded-xl border border-[#3a7f90] bg-[#418DA2] p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-100">
              Link to Lesson Plan
            </h2>
            <p className="mt-1 text-sm text-white/60">{selectedFile.name}</p>

            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Title *"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={inputClass}
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={inputClass}
                rows={2}
              />
              <input
                type="text"
                placeholder="Grade Level * (e.g., K-2)"
                value={formData.gradeLevel}
                onChange={(e) =>
                  setFormData({ ...formData, gradeLevel: e.target.value })
                }
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Topic * (e.g., Animals)"
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Language Skill * (e.g., Vocabulary)"
                value={formData.languageSkill}
                onChange={(e) =>
                  setFormData({ ...formData, languageSkill: e.target.value })
                }
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setSelectedFile(null)}
                className="rounded-lg border border-navy-700 px-4 py-2 text-sm font-medium text-white/90 hover:bg-[#418DA2]"
              >
                Cancel
              </button>
              <button
                onClick={handleLink}
                disabled={
                  linking ||
                  !formData.title ||
                  !formData.gradeLevel ||
                  !formData.topic ||
                  !formData.languageSkill
                }
                className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600 disabled:opacity-50"
              >
                {linking ? "Linking..." : "Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
