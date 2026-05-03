"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function CreateMilestoneModal({ open, onClose, onSubmit, goals }) {
  const [form, setForm] = useState({
    goalId: "",
    title: "",
    description: "",
    status: "NOT_STARTED",
    progress: 0,
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.goalId) return setError("Please select a goal");
    if (!form.title.trim()) return setError("Milestone title is required");

    try {
      setLoading(true);
      await onSubmit(form);
      setForm({
        goalId: "",
        title: "",
        description: "",
        status: "NOT_STARTED",
        progress: 0,
        dueDate: "",
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4 sm:p-6 backdrop-blur-sm">
      <div className="mx-auto my-6 w-full max-w-2xl max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Milestone</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Break a goal into a trackable step.</p>
          </div>

          <button onClick={onClose} className="cursor-pointer rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Goal</label>
            <select
              value={form.goalId}
              onChange={(e) => setForm({ ...form, goalId: e.target.value })}
              className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Select goal</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Complete design system"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Describe this milestone..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Progress</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.progress}
                onChange={(e) => setForm({ ...form, progress: e.target.value })}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Due date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="cursor-pointer rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Milestone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
