"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import DashboardShell from "../../../components/dashboard/DashboardShell";
import WorkspaceDetailSkeleton from "../../../components/workspaces/WorkspaceDetailSkeleton";
import { workspaceApi } from "../../../features/workspaces/services/workspaceApi";
import { useWorkspaceSocket } from "../../../hooks/useWorkspaceSocket";
import { usePresenceStore } from "../../../store/presenceStore";

export default function WorkspaceDetailPage({ params }) {
  const { workspaceId } = use(params);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const setOnlineUsers = usePresenceStore((s) => s.setOnlineUsers);
  const onlineUsersByWorkspace = usePresenceStore((s) => s.onlineUsersByWorkspace);
  const presence = onlineUsersByWorkspace[workspaceId] || { users: [], count: 0 };

  async function fetchOverview() {
    try {
      setLoading(true);
      setError("");
      const data = await workspaceApi.getWorkspaceOverview(workspaceId);
      setOverview(data);
    } catch (err) {
      setError(err.message || "Failed to load workspace overview");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setOverview(null);
    fetchOverview();
  }, [workspaceId]);

  useWorkspaceSocket(workspaceId, {
    "presence:updated": ({ workspaceId: incomingWorkspaceId, users, count }) => {
      if (incomingWorkspaceId === workspaceId) setOnlineUsers(workspaceId, users || [], count);
    },
    "workspace:updated": fetchOverview,
    "workspace:member-added": fetchOverview,
    "announcement:created": fetchOverview,
    "goal:created": fetchOverview,
    "action-item:created": fetchOverview,
  });

  if (loading) {
    return (
      <DashboardShell>
        <WorkspaceDetailSkeleton />
      </DashboardShell>
    );
  }

  if (error || !overview) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error || "Workspace not found"}</div>
      </DashboardShell>
    );
  }

  const { workspace, myRole, members, stats, latestGoals, latestActionItems, latestAnnouncements } = overview;
  const onlineIds = new Set((presence.users || []).map((user) => user.id));
  const pinnedAnnouncement = (latestAnnouncements || []).find((item) => item.pinned);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{workspace.name}</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{workspace.description || "No description provided."}</p>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:text-slate-200">Role: {myRole}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:text-slate-200">
                  Accent <span className="h-3 w-3 rounded-full" style={{ backgroundColor: workspace.accentColor }} />
                </span>
              </div>
            </div>
            {myRole === "ADMIN" ? (
              <Link href="/workspaces" className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">
                Edit Workspace
              </Link>
            ) : null}
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {[
            ["Goals", stats.goals],
            ["Milestones", stats.milestones],
            ["Action Items", stats.actionItems],
            ["Completed Tasks", stats.completedTasks],
            ["Announcements", stats.announcements],
            ["Members", stats.members],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Members</h2>
            {myRole === "ADMIN" ? <Link href="/admin/members" className="text-sm font-semibold text-violet-600">Invite / Manage</Link> : null}
          </div>
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{member.user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{member.user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {onlineIds.has(member.user.id) ? <span className="text-xs font-semibold text-emerald-600">Online</span> : null}
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    member.role === "ADMIN"
                      ? "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}>{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Goals</h2>
            <Link href={`/goals?workspaceId=${workspaceId}`} className="text-sm font-semibold text-violet-600">Open Goals</Link>
          </div>
          {(latestGoals || []).map((goal) => <p key={goal.id} className="py-1 text-sm text-slate-700 dark:text-slate-200">{goal.title}</p>)}
        </section>

        <section className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Action Items</h2>
            <Link href={`/action-items?workspaceId=${workspaceId}`} className="text-sm font-semibold text-violet-600">Open Action Items</Link>
          </div>
          {(latestActionItems || []).map((item) => (
            <p key={item.id} className="py-1 text-sm text-slate-700 dark:text-slate-200">{item.title} - {item.status} - {item.priority}</p>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Announcements</h2>
            <Link href={`/announcements?workspaceId=${workspaceId}`} className="text-sm font-semibold text-violet-600">Open Announcements</Link>
          </div>
          {pinnedAnnouncement ? (
            <div className="mb-3 rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm text-violet-900 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300">
              Pinned: {pinnedAnnouncement.title}
            </div>
          ) : null}
          {(latestAnnouncements || []).map((announcement) => (
            <p key={announcement.id} className="py-1 text-sm text-slate-700 dark:text-slate-200">{announcement.title}</p>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Online Members</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{presence.count || presence.users?.length || 0} currently online</p>
        </section>
      </div>
    </DashboardShell>
  );
}
