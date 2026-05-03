"use client";

import { Activity } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { useAnalyticsStore } from "../../store/analyticsStore";
const EMPTY_ACTIVITY = [];

export default function RecentActivity() {
  const analytics = useAnalyticsStore((state) => state.analytics);
  const recentActivity = analytics?.recentActivity || EMPTY_ACTIVITY;

  return (
    <DashboardCard title="Recent Activity">
      <div className="space-y-3">
        {recentActivity.length > 0 ? (
          recentActivity.map((item) => (
            <div key={item.id} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.action}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {item.entityType} · {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No recent activity yet.
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
