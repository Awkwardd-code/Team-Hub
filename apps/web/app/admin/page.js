"use client";

import { useEffect } from "react";
import AdminRoute from "../../components/auth/AdminRoute";
import DashboardShell from "../../components/dashboard/DashboardShell";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useAdminMemberStore } from "../../store/adminMemberStore";
import { useAuditLogStore } from "../../store/auditLogStore";
import Link from "next/link";
import { Users, LayoutGrid, Shield, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  const { workspaces, fetchWorkspaces } = useWorkspaceStore();
  const { overview, fetchOverview } = useAdminMemberStore();
  const { logs, fetchLogs } = useAuditLogStore();

  useEffect(() => {
    fetchWorkspaces();
    fetchLogs();
    fetchOverview();
  }, [fetchWorkspaces, fetchLogs, fetchOverview]);

  return (
    <DashboardShell>
      <AdminRoute>
        <div className="mx-auto max-w-6xl space-y-6">
          {/* HEADER */}
          <header>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Monitor and control workspace-wide administration.
            </p>
          </header>

          {/* STATS */}
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <LayoutGrid className="text-violet-600" />
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Workspaces
                </h3>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {overview?.workspaceCount ?? workspaces.length}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Users className="text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Members (Admin Workspaces)
                </h3>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {overview?.memberCount ?? 0}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Activity className="text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Pending Invitations
                </h3>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                {overview?.pendingInvitations ?? 0}
              </p>
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="grid gap-4 md:grid-cols-3">
            <Link
              href="/admin/members"
              className="cursor-pointer rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <Users className="text-violet-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">Manage Members</h3>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Invite users, assign roles, and control access.
              </p>
            </Link>

            <Link
              href="/admin/workspace-settings"
              className="cursor-pointer rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <Shield className="text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Workspace Settings
                </h3>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Configure policies, defaults, and permissions.
              </p>
            </Link>

            <Link
              href="/admin/audit-log"
              className="cursor-pointer rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <Activity className="text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">Audit Logs</h3>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Track admin actions and system activity.
              </p>
            </Link>
          </section>

          {/* RECENT ACTIVITY */}
          <section className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h2>
              <Link
                href="/admin/audit-log"
                className="text-sm font-medium text-violet-600 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {(overview?.recentAuditLogs || logs).slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {log.action}
                    </p>
                    <span className="text-xs text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {log.user?.email || "System"} • {log.entityType}
                  </p>
                </div>
              ))}

              {logs.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No recent activity available.
                </p>
              )}
            </div>
          </section>
        </div>
      </AdminRoute>
    </DashboardShell>
  );
}
