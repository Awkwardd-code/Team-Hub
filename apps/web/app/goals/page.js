"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../../components/dashboard/DashboardShell";
import GoalCard from "../../components/goals/GoalCard";
import CreateGoalModal from "../../components/goals/CreateGoalModal";
import GoalSkeleton from "../../components/goals/GoalSkeleton";
import EmptyGoalsState from "../../components/goals/EmptyGoalsState";
import EditGoalModal from "../../components/goals/EditGoalModal";
import { useGoalStore } from "../../store/goalStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useWorkspaceSocket } from "../../hooks/useWorkspaceSocket";
import { usePresenceStore } from "../../store/presenceStore";
import { workspaceApi } from "../../features/workspaces/services/workspaceApi";
import { useConfirm } from "../../components/common/ConfirmModal";

export default function GoalsPage() {
  const {
    goals,
    loading,
    error,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    createGoalUpdate,
    addGoalFromSocket,
    updateGoalFromSocket,
    deleteGoalFromSocket,
    addGoalUpdateFromSocket,
  } = useGoalStore();
  const { workspaces, selectedWorkspace, fetchWorkspaces } = useWorkspaceStore();
  const setOnlineUsers = usePresenceStore((s) => s.setOnlineUsers);

  const [createOpen, setCreateOpen] = useState(false);
  const [workspaceFilter, setWorkspaceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editGoal, setEditGoal] = useState(null);
  const [membersByWorkspace, setMembersByWorkspace] = useState({});
  const confirm = useConfirm();

  useEffect(() => {
    fetchWorkspaces();
    fetchGoals();
  }, [fetchWorkspaces, fetchGoals]);

  async function ensureMembers(workspaceId) {
    if (!workspaceId || membersByWorkspace[workspaceId]) return;
    try {
      const workspace = await workspaceApi.getWorkspace(workspaceId);
      setMembersByWorkspace((prev) => ({
        ...prev,
        [workspaceId]: (workspace.members || []).map((member) => member.user),
      }));
    } catch {
      setMembersByWorkspace((prev) => ({ ...prev, [workspaceId]: [] }));
    }
  }

  useEffect(() => {
    const workspaceIds = Array.from(new Set(goals.map((goal) => goal.workspaceId).filter(Boolean)));
    workspaceIds.forEach((workspaceId) => ensureMembers(workspaceId));
  }, [goals]);

  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      const matchWorkspace = workspaceFilter ? goal.workspaceId === workspaceFilter : true;
      const matchStatus = statusFilter ? goal.status === statusFilter : true;
      return matchWorkspace && matchStatus;
    });
  }, [goals, workspaceFilter, statusFilter]);

  const activeWorkspaceId = selectedWorkspace?.id || workspaceFilter || workspaces[0]?.id || "";
  useWorkspaceSocket(activeWorkspaceId, {
    "goal:created": addGoalFromSocket,
    "goal:updated": updateGoalFromSocket,
    "goal:deleted": ({ id }) => deleteGoalFromSocket(id),
    "goal:update-created": addGoalUpdateFromSocket,
    "presence:updated": ({ workspaceId, users, count }) => setOnlineUsers(workspaceId, users || [], count),
  });

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Goals</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Create, track, and manage workspace goals.</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="cursor-pointer rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
          >
            + Create Goal
          </button>
        </header>

        <section className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Workspace</label>
              <select
                value={workspaceFilter}
                onChange={(e) => setWorkspaceFilter(e.target.value)}
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
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">All statuses</option>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
          </div>
        </section>

        {error ? <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">{error}</div> : null}

        {loading ? (
          <GoalSkeleton />
        ) : filteredGoals.length === 0 ? (
          <EmptyGoalsState onCreate={() => setCreateOpen(true)} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={setEditGoal}
                onDelete={async (id) => {
                  const confirmed = await confirm({
                    title: "Delete goal?",
                    description: "This action cannot be undone.",
                    confirmText: "Delete",
                    variant: "danger",
                  });
                  if (!confirmed) return;
                  await deleteGoal(id);
                }}
                onCreateUpdate={createGoalUpdate}
                members={membersByWorkspace[goal.workspaceId] || []}
              />
            ))}
          </div>
        )}
      </div>

      <CreateGoalModal open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={createGoal} workspaces={workspaces} />
      <EditGoalModal open={Boolean(editGoal)} goal={editGoal} onClose={() => setEditGoal(null)} onSubmit={updateGoal} />
    </DashboardShell>
  );
}
