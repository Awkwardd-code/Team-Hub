"use client";

import { useMemo } from "react";
import { CheckCircle2, Clock3, Target, Users } from "lucide-react";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { usePresenceStore } from "../../store/presenceStore";

const EMPTY_PRESENCE = { users: [], count: 0 };

export default function StatsCards() {
  const analytics = useAnalyticsStore((state) => state.analytics);
  const activeWorkspaceId = usePresenceStore((state) => state.activeWorkspaceId);
  const onlineUsersByWorkspace = usePresenceStore((state) => state.onlineUsersByWorkspace);
  const activePresence = activeWorkspaceId
    ? onlineUsersByWorkspace[activeWorkspaceId] || EMPTY_PRESENCE
    : EMPTY_PRESENCE;

  const stats = useMemo(() => {
    const stats = analytics?.stats || {};

    return [
      {
        label: "Total Goals",
        value: stats.totalGoals || 0,
        trend: `${stats.completedGoals || 0} completed`,
        icon: Target,
        theme: "bg-violet-100 text-violet-700",
      },
      {
        label: "Tasks Completed",
        value: stats.completedActionItems || 0,
        trend: `${stats.totalActionItems || 0} total action items`,
        icon: CheckCircle2,
        theme: "bg-emerald-100 text-emerald-700",
      },
      {
        label: "Overdue Tasks",
        value: stats.overdueActionItems || 0,
        trend: (stats.overdueActionItems || 0) > 0 ? "Needs attention" : "No overdue tasks",
        icon: Clock3,
        theme: "bg-orange-100 text-orange-700",
      },
      {
        label: "Members Online",
        value: activePresence.count || activePresence.users.length,
        trend: "Live presence",
        icon: Users,
        theme: "bg-sky-100 text-sky-700",
      },
    ];
  }, [analytics, activePresence.count, activePresence.users.length]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.theme}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">{stat.trend}</p>
          </article>
        );
      })}
    </div>
  );
}
