"use client";

import { useState } from "react";
import { X } from "lucide-react";
import MentionTextarea from "../common/MentionTextarea";

export default function CreateAnnouncementModal({
  open,
  onClose,
  onSubmit,
  workspaces,
  members = [],
  onWorkspaceChange,
}) {
  const [form, setForm] = useState({
    workspaceId: "",
    title: "",
    content: "",
    pinned: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.workspaceId) return setError("Please select a workspace");
    if (!form.title.trim()) return setError("Title is required");
    if (!form.content.trim()) return setError("Content is required");

    try {
      setLoading(true);
      await onSubmit(form);
      setForm({ workspaceId: "", title: "", content: "", pinned: false });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4 sm:p-6 backdrop-blur-sm">
      <div className="mx-auto my-6 w-full max-w-2xl max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl border border-slate-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Announcement</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Share an update with your workspace.</p>
          </div>

          <button onClick={onClose} className="cursor-pointer rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Workspace</label>
            <select
              value={form.workspaceId}
              onChange={(e) => {
                const workspaceId = e.target.value;
                setForm({ ...form, workspaceId });
                onWorkspaceChange?.(workspaceId);
              }}
              className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="">Select workspace</option>
              {workspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              placeholder="Weekly product update"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Content</label>
            <MentionTextarea
              value={form.content}
              onChange={(content) => setForm({ ...form, content })}
              members={members}
              className="mt-2 min-h-36 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Write your announcement..."
              rows={6}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              className="h-4 w-4 cursor-pointer accent-violet-600"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Pin this announcement</span>
          </label>

          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="cursor-pointer rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
