"use client";

import { useState } from "react";

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

export default function ContentManagementPage() {
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

  async function browseDrive(pageToken?: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (pageToken) params.set("pageToken", pageToken);
      const res = await fetch(`/api/admin/drive/browse?${params}`);
      const data = await res.json();
      if (res.ok) {
        setFiles(pageToken ? [...files, ...data.files] : data.files);
        setNextPageToken(data.nextPageToken);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } finally {
      setLoading(false);
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

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Content Management
          </h1>
          <p className="mt-2 text-gray-600">
            Browse Google Drive and link files as lesson plans
          </p>
        </div>
        <button
          onClick={() => browseDrive()}
          disabled={loading}
          className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Browse Drive"}
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
          {message}
        </div>
      )}

      {/* File grid */}
      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              {file.thumbnailLink && (
                <img
                  src={file.thumbnailLink}
                  alt={file.name}
                  className="mb-3 h-32 w-full rounded object-cover"
                />
              )}
              <h3 className="truncate text-sm font-medium text-gray-900">
                {file.name}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(file.modifiedTime).toLocaleDateString()}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openLinkModal(file)}
                  className="rounded bg-pink-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-pink-700"
                >
                  Link to lesson plan
                </button>
                {file.webViewLink && (
                  <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View
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
            className="text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            Load more
          </button>
        </div>
      )}

      {/* Link modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Link to Lesson Plan
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {selectedFile.name}
            </p>

            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Title *"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                rows={2}
              />
              <input
                type="text"
                placeholder="Grade Level * (e.g., K-2)"
                value={formData.gradeLevel}
                onChange={(e) =>
                  setFormData({ ...formData, gradeLevel: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Topic * (e.g., Animals)"
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Language Skill * (e.g., Vocabulary)"
                value={formData.languageSkill}
                onChange={(e) =>
                  setFormData({ ...formData, languageSkill: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setSelectedFile(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
                className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50"
              >
                {linking ? "Linking…" : "Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
