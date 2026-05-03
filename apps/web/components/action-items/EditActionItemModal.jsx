"use client";

import { useEffect, useState } from "react";
import { workspaceApi } from "../../features/workspaces/services/workspaceApi";
import { goalApi } from "../../features/goals/services/goalApi";

export default function EditActionItemModal({ open, item, onClose, onSubmit }) {
  const [form, setForm] = useState({
    goalId: "",
    assigneeId: "",
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
  });
  const [members, setMembers] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (open && item) {
      setForm({
        goalId: item.goalId || "",
        assigneeId: item.assigneeId || "",
        title: item.title || "",
        description: item.description || "",
        status: item.status || "TODO",
        priority: item.priority || "MEDIUM",
        dueDate: item.dueDate ? new Date(item.dueDate).toISOString().slice(0, 10) : "",
      });

      workspaceApi
        .getWorkspace(item.workspaceId)
        .then((workspace) => setMembers(workspace.members || []))
        .catch(() => setMembers([]));

      goalApi
        .getGoals(item.workspaceId)
        .then((items) => setGoals(items || []))
        .catch(() => setGoals([]));
    }
  }, [open, item]);

  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4 sm:p-6 backdrop-blur-sm">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await onSubmit(item.id, {
            ...form,
            assigneeId: form.assigneeId || null,
            goalId: form.goalId || null,
            dueDate: form.dueDate || null,
          });
          onClose();
        }}
        className="mx-auto my-6 w-full max-w-xl space-y-4 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Action Item</h2>

        <input
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
        />

        <textarea
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
        />

        <select
          className="w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2"
          value={form.goalId}
          onChange={(e) => setForm({ ...form, goalId: e.target.value })}
        >
          <option value="">No parent goal</option>
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>

        <div className="grid gap-4 md:grid-cols-2">
          <select
            className="w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2"
            value={form.assigneeId}
            onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.userId || member.user?.id} value={member.userId || member.user?.id}>
                {member.user?.name || member.user?.email}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <select
            className="w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
            <option value="BLOCKED">Blocked</option>
          </select>

          <select
            className="w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-700 dark:text-slate-200">
            Cancel
          </button>
          <button className="cursor-pointer rounded-xl bg-violet-600 px-4 py-2 text-white">Save</button>
        </div>
      </form>
    </div>
  );
}
