"use client";

import { useEffect, useState } from "react";
import DashboardShell from "../../components/dashboard/DashboardShell";
import AnalyticsSkeleton from "../../components/analytics/AnalyticsSkeleton";
import AnalyticsStats from "../../components/analytics/AnalyticsStats";
import ProgressTrendChart from "../../components/analytics/ProgressTrendChart";
import StatusDonutChart from "../../components/analytics/StatusDonutChart";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { useWorkspaceStore } from "../../store/workspaceStore";

export default function AnalyticsPage() {
  const { analytics, loading, error, fetchAnalytics } = useAnalyticsStore();
  const { workspaces, fetchWorkspaces } = useWorkspaceStore();
  const [workspaceFilter, setWorkspaceFilter] = useState("");

  useEffect(() => {
    fetchWorkspaces();
    fetchAnalytics();
  }, [fetchWorkspaces, fetchAnalytics]);

  async function handleWorkspaceChange(value) {
    setWorkspaceFilter(value);
    await fetchAnalytics(value);
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Measure workspace performance, productivity, and trends.
            </p>
          </div>

          <select
            value={workspaceFilter}
            onChange={(e) => handleWorkspaceChange(e.target.value)}
            className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">All workspaces</option>
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
        </header>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {loading || !analytics ? (
          <AnalyticsSkeleton />
        ) : (
          <div className="space-y-6">
            <AnalyticsStats stats={analytics.stats} />

            <div className="grid gap-6 xl:grid-cols-2">
              <ProgressTrendChart data={analytics.progressTrend} />

              <StatusDonutChart
                title="Goal Status"
                subtitle="Distribution of goals by current state."
                data={analytics.goalStatus}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <StatusDonutChart
                title="Milestone Status"
                subtitle="How milestones are moving across your workspaces."
                data={analytics.milestoneStatus}
              />

              <StatusDonutChart
                title="Action Item Status"
                subtitle="Execution visibility for current tasks."
                data={analytics.actionItemStatus}
              />
            </div>

            <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Activity Summary</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Recent workspace activity will appear here as the audit log grows.
              </p>

              <div className="mt-6 space-y-3">
                {analytics.recentActivity?.length > 0 ? (
                  analytics.recentActivity.map((activity) => (
                    <div key={activity.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.action}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activity.entityType} · {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-6 text-center">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">No activity yet</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Actions like creating goals, milestones, and announcements can be logged here later.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

