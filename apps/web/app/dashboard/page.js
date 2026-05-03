"use client";

import { useMemo } from "react";
import DashboardShell from "../../components/dashboard/DashboardShell";
import GoalProgress from "../../components/dashboard/GoalProgress";
import OnlineMembers from "../../components/dashboard/OnlineMembers";
import RecentActivity from "../../components/dashboard/RecentActivity";
import StatsCards from "../../components/dashboard/StatsCards";
import TasksByStatus from "../../components/dashboard/TasksByStatus";
import UpcomingDeadlines from "../../components/dashboard/UpcomingDeadlines";
import { useAuthStore } from "../../store/authStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { usePresenceStore } from "../../store/presenceStore";
import { useWorkspaceSocket } from "../../hooks/useWorkspaceSocket";
import { useEffect } from "react";
import { useGoalStore } from "../../store/goalStore";
import { useActionItemStore } from "../../store/actionItemStore";
import { useAnnouncementStore } from "../../store/announcementStore";
import { useAnalyticsStore } from "../../store/analyticsStore";

function firstName(nameOrEmail) {
  if (!nameOrEmail) return "there";
  return nameOrEmail.split(" ")[0] || nameOrEmail;
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const selectedWorkspace = useWorkspaceStore((s) => s.selectedWorkspace);
  const fetchWorkspaces = useWorkspaceStore((s) => s.fetchWorkspaces);
  const setOnlineUsers = usePresenceStore((s) => s.setOnlineUsers);
  const fetchGoals = useGoalStore((s) => s.fetchGoals);
  const fetchActionItems = useActionItemStore((s) => s.fetchActionItems);
  const fetchAnnouncements = useAnnouncementStore((s) => s.fetchAnnouncements);
  const fetchAnalytics = useAnalyticsStore((s) => s.fetchAnalytics);
  const analyticsLoading = useAnalyticsStore((s) => s.loading);

  const activeWorkspaceId = useMemo(
    () => selectedWorkspace?.id || workspaces[0]?.id || "",
    [selectedWorkspace?.id, workspaces]
  );

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (!activeWorkspaceId) return;
    fetchGoals(activeWorkspaceId);
    fetchActionItems({ workspaceId: activeWorkspaceId });
    fetchAnnouncements(activeWorkspaceId);
    fetchAnalytics(activeWorkspaceId);
  }, [activeWorkspaceId, fetchGoals, fetchActionItems, fetchAnnouncements, fetchAnalytics]);

  useWorkspaceSocket(activeWorkspaceId, {
    "presence:updated": ({ workspaceId, users, count }) => setOnlineUsers(workspaceId, users || [], count),
  });

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {firstName(user?.name || user?.email)}.
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Here&apos;s what&apos;s happening in{" "}
            <span className="font-semibold text-violet-600 dark:text-violet-400">
              {selectedWorkspace?.name || workspaces[0]?.name || "your workspace"}
            </span>{" "}
            today.
          </p>
        </header>

        {!activeWorkspaceId ? (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">No workspace selected</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Create or open a workspace to view dashboard data.</p>
          </section>
        ) : null}

        {activeWorkspaceId ? <StatsCards /> : null}

        {activeWorkspaceId ? (
          <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <GoalProgress />
            <TasksByStatus />
          </section>
        ) : null}

        {activeWorkspaceId ? (
          <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <UpcomingDeadlines />
            </div>
            <div className="space-y-5 xl:col-span-1">
              <RecentActivity />
              <OnlineMembers />
            </div>
          </section>
        ) : null}
        {analyticsLoading && activeWorkspaceId ? <p className="text-sm text-slate-500 dark:text-slate-400">Loading dashboard data...</p> : null}
      </div>
    </DashboardShell>
  );
}
