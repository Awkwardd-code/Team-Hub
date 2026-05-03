"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../../components/dashboard/DashboardShell";
import ActionItemsKanban from "../../components/action-items/ActionItemsKanban";
import ActionItemsList from "../../components/action-items/ActionItemsList";
import CreateActionItemModal from "../../components/action-items/CreateActionItemModal";
import EditActionItemModal from "../../components/action-items/EditActionItemModal";
import ActionItemSkeleton from "../../components/action-items/ActionItemSkeleton";
import EmptyActionItemsState from "../../components/action-items/EmptyActionItemsState";
import { useActionItemStore } from "../../store/actionItemStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useGoalStore } from "../../store/goalStore";
import { useWorkspaceSocket } from "../../hooks/useWorkspaceSocket";
import { usePresenceStore } from "../../store/presenceStore";
import { useConfirm } from "../../components/common/ConfirmModal";
export default function ActionItemsPage() {
  const {
    actionItems,
    loading,
    error,
    fetchActionItems,
    createActionItem,
    updateActionItem,
    deleteActionItem,
  } = useActionItemStore();
const {
  addActionItemFromSocket,
  updateActionItemFromSocket,
  deleteActionItemFromSocket,
} = useActionItemStore();
  const setOnlineUsers = usePresenceStore((s) => s.setOnlineUsers);
  const { workspaces, selectedWorkspace, fetchWorkspaces } = useWorkspaceStore();
  const { goals, fetchGoals } = useGoalStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [view, setView] = useState("kanban");
  const [workspaceFilter, setWorkspaceFilter] = useState("");
  const [goalFilter, setGoalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [editItem, setEditItem] = useState(null);
  const confirm = useConfirm();

  useEffect(() => {
    fetchWorkspaces();
    fetchGoals();
    fetchActionItems();
  }, [fetchWorkspaces, fetchGoals, fetchActionItems]);

  const filteredGoals = useMemo(() => {
    if (!workspaceFilter) return goals;
    return goals.filter((goal) => goal.workspaceId === workspaceFilter);
  }, [goals, workspaceFilter]);

  const filteredItems = useMemo(() => {
    return actionItems.filter((item) => {
      const matchWorkspace = workspaceFilter ? item.workspaceId === workspaceFilter : true;
      const matchGoal = goalFilter ? item.goalId === goalFilter : true;
      const matchStatus = statusFilter ? item.status === statusFilter : true;
      const matchPriority = priorityFilter ? item.priority === priorityFilter : true;

      return matchWorkspace && matchGoal && matchStatus && matchPriority;
    });
  }, [actionItems, workspaceFilter, goalFilter, statusFilter, priorityFilter]);

  async function handleCreate(payload) {
    await createActionItem(payload);
  }
const activeWorkspaceId = selectedWorkspace?.id || workspaceFilter || workspaces[0]?.id || "";
useWorkspaceSocket(activeWorkspaceId, {
  "action-item:created": addActionItemFromSocket,
  "action-item:updated": updateActionItemFromSocket,
  "action-item:deleted": ({ id }) => deleteActionItemFromSocket(id),
  "presence:updated": ({ workspaceId, users, count }) => setOnlineUsers(workspaceId, users || [], count),
});
  async function handleStatusChange(id, status) {
    await updateActionItem(id, { status });
  }

  async function handleDelete(id) {
    const confirmed = await confirm({
      title: "Delete action item?",
      description: "This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;

    await deleteActionItem(id);
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Action Items</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Track assignments, ownership, and task completion status.
            </p>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="cursor-pointer rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            + Create Action Item
          </button>
        </header>

        <section className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Workspace</label>
              <select
                value={workspaceFilter}
                onChange={(e) => {
                  setWorkspaceFilter(e.target.value);
                  setGoalFilter("");
                }}
                className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">All workspaces</option>
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Goal</label>
              <select
                value={goalFilter}
                onChange={(e) => setGoalFilter(e.target.value)}
                className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">All goals</option>
                {filteredGoals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">All statuses</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">All priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">View</label>
              <div className="mt-2 grid grid-cols-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 p-1">
                <button
                  onClick={() => setView("kanban")}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold ${
                    view === "kanban"
                      ? "bg-violet-600 text-white"
                      : "text-slate-600 dark:text-slate-300 hover:bg-white dark:bg-slate-900"
                  }`}
                >
                  Kanban
                </button>

                <button
                  onClick={() => setView("list")}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold ${
                    view === "list"
                      ? "bg-violet-600 text-white"
                      : "text-slate-600 dark:text-slate-300 hover:bg-white dark:bg-slate-900"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <ActionItemSkeleton />
        ) : filteredItems.length === 0 ? (
          <EmptyActionItemsState onCreate={() => setCreateOpen(true)} />
        ) : view === "kanban" ? (
          <ActionItemsKanban
            items={filteredItems}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onEdit={setEditItem}
          />
        ) : (
          <ActionItemsList
            items={filteredItems}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onEdit={setEditItem}
          />
        )}
      </div>

      <CreateActionItemModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        workspaces={workspaces}
        goals={goals}
      />
      <EditActionItemModal
        open={Boolean(editItem)}
        item={editItem}
        onClose={() => setEditItem(null)}
        onSubmit={updateActionItem}
      />
    </DashboardShell>
  );
}
