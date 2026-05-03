"use client";

import { BarChart3, CheckCircle, Clock, Flag } from "lucide-react";

export default function AnalyticsStats({ stats }) {
  const cards = [
    {
      label: "Total Goals",
      value: stats.totalGoals,
      icon: BarChart3,
      tone: "bg-violet-50 text-violet-700",
      helper: `${stats.goalCompletionRate}% completion rate`,
    },
    {
      label: "Completed This Week",
      value: stats.completedThisWeek,
      icon: CheckCircle,
      tone: "bg-emerald-50 text-emerald-700",
      helper: `${stats.completedGoals} completed total`,
    },
    {
      label: "Overdue Goals",
      value: stats.overdueGoals,
      icon: Clock,
      tone: "bg-red-50 text-red-700",
      helper: "Needs attention",
    },
    {
      label: "Milestones",
      value: stats.totalMilestones,
      icon: Flag,
      tone: "bg-blue-50 text-blue-700",
      helper: `${stats.milestoneCompletionRate}% completed`,
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div key={card.label} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.tone}`}>
                <Icon size={22} />
              </div>
            </div>

            <h3 className="mt-5 text-3xl font-bold text-slate-900">{card.value}</h3>
            <p className="mt-2 text-sm text-slate-500">{card.helper}</p>
          </div>
        );
      })}
    </div>
  );
}
