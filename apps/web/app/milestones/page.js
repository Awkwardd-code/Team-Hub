"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../../components/dashboard/DashboardShell";
import MilestoneCard from "../../components/milestones/MilestoneCard";
import CreateMilestoneModal from "../../components/milestones/CreateMilestoneModal";
import MilestoneSkeleton from "../../components/milestones/MilestoneSkeleton";
import EmptyMilestonesState from "../../components/milestones/EmptyMilestonesState";
import EditMilestoneModal from "../../components/milestones/EditMilestoneModal";
import { useMilestoneStore } from "../../store/milestoneStore";
import { useGoalStore } from "../../store/goalStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useWorkspaceSocket } from "../../hooks/useWorkspaceSocket";
import { usePresenceStore } from "../../store/presenceStore";
import { useConfirm } from "../../components/common/ConfirmModal";
export default function MilestonesPage() {
  const {
    milestones,
    loading,
    error,
    fetchMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone,
  } = useMilestoneStore();
const {
  addMilestoneFromSocket,
  updateMilestoneFromSocket,
  deleteMilestoneFromSocket,
} = useMilestoneStore();
  const setOnlineUsers = usePresenceStore((s) => s.setOnlineUsers);
  const { goals, fetchGoals } = useGoalStore();
  const { workspaces, selectedWorkspace, fetchWorkspaces } = useWorkspaceStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [workspaceFilter, setWorkspaceFilter] = useState("");
  const [goalFilter, setGoalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editMilestone, setEditMilestone] = useState(null);
  const confirm = useConfirm();

  useEffect(() => {
    fetchWorkspaces();
    fetchGoals();
    fetchMilestones();
  }, [fetchWorkspaces, fetchGoals, fetchMilestones]);

  const filteredGoals = useMemo(() => {
    if (!workspaceFilter) return goals;
    return goals.filter((goal) => goal.workspaceId === workspaceFilter);
  }, [goals, workspaceFilter]);

  const filteredMilestones = useMemo(() => {
    return milestones.filter((milestone) => {
      const matchWorkspace = workspaceFilter
        ? milestone.goal?.workspaceId === workspaceFilter
        : true;

      const matchGoal = goalFilter ? milestone.goalId === goalFilter : true;
      const matchStatus = statusFilter ? milestone.status === statusFilter : true;

      return matchWorkspace && matchGoal && matchStatus;
    });
  }, [milestones, workspaceFilter, goalFilter, statusFilter]);
const activeWorkspaceId = selectedWorkspace?.id || workspaceFilter || workspaces[0]?.id || "";
useWorkspaceSocket(activeWorkspaceId, {
  "milestone:created": addMilestoneFromSocket,
  "milestone:updated": updateMilestoneFromSocket,
  "milestone:deleted": ({ id }) => deleteMilestoneFromSocket(id),
  "presence:updated": ({ workspaceId, users, count }) => setOnlineUsers(workspaceId, users || [], count),
});
  async function handleCreate(payload) {
    await createMilestone(payload);
  }

  async function handleProgressChange(id, progress) {
    await updateMilestone(id, { progress });
  }

  async function handleStatusChange(id, status) {
    await updateMilestone(id, { status });
  }

  async function handleDelete(id) {
    const confirmed = await confirm({
      title: "Delete milestone?",
      description: "This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;

    await deleteMilestone(id);
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Milestones</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Break goals into milestones and track progress clearly.
            </p>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="cursor-pointer rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            + Create Milestone
          </button>
        </header>

        <section className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
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
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <MilestoneSkeleton />
        ) : filteredMilestones.length === 0 ? (
          <EmptyMilestonesState onCreate={() => setCreateOpen(true)} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredMilestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                onProgressChange={handleProgressChange}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onEdit={setEditMilestone}
              />
            ))}
          </div>
        )}
      </div>

      <CreateMilestoneModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        goals={goals}
      />
      <EditMilestoneModal
        open={Boolean(editMilestone)}
        milestone={editMilestone}
        onClose={() => setEditMilestone(null)}
        onSubmit={updateMilestone}
      />
    </DashboardShell>
  );
}
