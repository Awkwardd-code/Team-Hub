"use client";

import { useEffect, useState } from "react";

export default function EditMilestoneModal({ open, milestone, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "NOT_STARTED",
    progress: 0,
    dueDate: "",
  });

  useEffect(() => {
    if (open && milestone) {
      setForm({
        title: milestone.title || "",
        description: milestone.description || "",
        status: milestone.status || "NOT_STARTED",
        progress: milestone.progress || 0,
        dueDate: milestone.dueDate ? new Date(milestone.dueDate).toISOString().slice(0, 10) : "",
      });
    }
  }, [open, milestone]);

  if (!open || !milestone) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4 sm:p-6 backdrop-blur-sm">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit(milestone.id, { ...form, progress: Number(form.progress) });
          onClose();
        }}
        className="mx-auto my-6 w-full max-w-lg max-h-[calc(100vh-3rem)] space-y-4 overflow-y-auto rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Milestone</h2>
        <input className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" min="0" max="100" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} />
        <select className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="BLOCKED">Blocked</option>
        </select>
        <input type="date" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-700 dark:text-slate-200">Cancel</button>
          <button className="rounded-xl bg-violet-600 px-4 py-2 text-white">Save</button>
        </div>
      </form>
    </div>
  );
}
