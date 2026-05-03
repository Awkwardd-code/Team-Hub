"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { workspaceApi } from "../../features/workspaces/services/workspaceApi";

export default function CreateActionItemModal({ open, onClose, onSubmit, workspaces, goals }) {
  const [form, setForm] = useState({
    workspaceId: "",
    goalId: "",
    assigneeId: "",
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
  });
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredGoals = useMemo(
    () => (form.workspaceId ? goals.filter((goal) => goal.workspaceId === form.workspaceId) : goals),
    [form.workspaceId, goals]
  );

  useEffect(() => {
    if (!open || !form.workspaceId) {
      setMembers([]);
      return;
    }

    let mounted = true;
    setLoadingMembers(true);
    workspaceApi
      .getWorkspace(form.workspaceId)
      .then((workspace) => {
        if (!mounted) return;
        setMembers(workspace.members || []);
      })
      .catch(() => {
        if (mounted) setMembers([]);
      })
      .finally(() => {
        if (mounted) setLoadingMembers(false);
      });

    return () => {
      mounted = false;
    };
  }, [form.workspaceId, open]);

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.workspaceId) return setError("Please select a workspace");
    if (!form.title.trim()) return setError("Title is required");

    try {
      setLoading(true);
      await onSubmit({
        ...form,
        goalId: form.goalId || undefined,
        assigneeId: form.assigneeId || undefined,
        dueDate: form.dueDate || undefined,
      });
      setForm({
        workspaceId: "",
        goalId: "",
        assigneeId: "",
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Action Item</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Assign a task and track it to completion.</p>
          </div>

          <button onClick={onClose} className="cursor-pointer rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Workspace</label>
              <select
                value={form.workspaceId}
                onChange={(e) => setForm({ ...form, workspaceId: e.target.value, goalId: "", assigneeId: "" })}
                className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
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
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Parent goal</label>
              <select
                value={form.goalId}
                onChange={(e) => setForm({ ...form, goalId: e.target.value })}
                className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">No parent goal</option>
                {filteredGoals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Assignee</label>
              <select
                value={form.assigneeId}
                onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
                className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">{loadingMembers ? "Loading members..." : "Unassigned"}</option>
                {members.map((member) => (
                  <option key={member.userId || member.user?.id} value={member.userId || member.user?.id}>
                    {member.user?.name || member.user?.email}
                  </option>
                ))}
              </select>
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

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Create homepage wireframes"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Describe the task..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p> : null}

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
              {loading ? "Creating..." : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
