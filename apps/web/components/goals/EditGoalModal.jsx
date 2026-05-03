"use client";

import { useEffect, useState } from "react";

export default function EditGoalModal({ open, goal, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "NOT_STARTED",
    dueDate: "",
  });

  useEffect(() => {
    if (goal && open) {
      setForm({
        title: goal.title || "",
        description: goal.description || "",
        status: goal.status || "NOT_STARTED",
        dueDate: goal.dueDate ? new Date(goal.dueDate).toISOString().slice(0, 10) : "",
      });
    }
  }, [goal, open]);

  if (!open || !goal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4 sm:p-6 backdrop-blur-sm">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit(goal.id, form);
          onClose();
        }}
        className="mx-auto my-6 w-full max-w-lg max-h-[calc(100vh-3rem)] space-y-4 overflow-y-auto rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Goal</h2>
        <input className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
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
