"use client";

import { useEffect, useState } from "react";
import MentionTextarea from "../common/MentionTextarea";

export default function EditAnnouncementModal({ open, announcement, onClose, onSubmit, members = [] }) {
  const [form, setForm] = useState({ title: "", content: "", pinned: false });

  useEffect(() => {
    if (open && announcement) {
      setForm({
        title: announcement.title || "",
        content: announcement.content || "",
        pinned: Boolean(announcement.pinned),
      });
    }
  }, [open, announcement]);

  if (!open || !announcement) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4 sm:p-6 backdrop-blur-sm">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit(announcement.id, form);
          onClose();
        }}
        className="mx-auto my-6 w-full max-w-2xl max-h-[calc(100vh-3rem)] space-y-4 overflow-y-auto rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Announcement</h2>
        <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <MentionTextarea
          value={form.content}
          onChange={(content) => setForm({ ...form, content })}
          members={members}
          className="min-h-40 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          rows={6}
        />
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} />
          Pin announcement
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 dark:border-slate-700 dark:text-slate-200">Cancel</button>
          <button className="rounded-xl bg-violet-600 px-4 py-2 text-white">Save</button>
        </div>
      </form>
    </div>
  );
}
