"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { useGoalStore } from "../../store/goalStore";
import { useActionItemStore } from "../../store/actionItemStore";

const priorityStyles = {
  HIGH: "bg-red-100 text-red-700",
  URGENT: "bg-rose-100 text-rose-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-emerald-100 text-emerald-700",
};

export default function UpcomingDeadlines() {
  const goals = useGoalStore((state) => state.goals);
  const actionItems = useActionItemStore((state) => state.actionItems);

  const deadlines = useMemo(() => {
    const upcoming = [
      ...goals
        .filter((goal) => goal.dueDate && goal.status !== "COMPLETED")
        .map((goal) => ({
          id: `goal-${goal.id}`,
          title: goal.title,
          type: "Goal",
          date: goal.dueDate,
          priority: goal.priority || "MEDIUM",
          href: "/goals",
        })),
      ...actionItems
        .filter((item) => item.dueDate && item.status !== "DONE")
        .map((item) => ({
          id: `action-${item.id}`,
          title: item.title,
          type: "Action Item",
          date: item.dueDate,
          priority: item.priority || "MEDIUM",
          href: "/action-items",
        })),
    ];

    return upcoming.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
  }, [actionItems, goals]);

  return (
    <DashboardCard
      title="Upcoming Deadlines"
      action={
        <Link href="/action-items" className="cursor-pointer text-xs font-medium text-violet-600 hover:underline">
          View all
        </Link>
      }
    >
      <div className="space-y-3">
        {deadlines.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            No upcoming deadlines yet.
          </div>
        ) : (
          deadlines.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {item.type} • {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                  priorityStyles[item.priority] || priorityStyles.MEDIUM
                }`}
              >
                {item.priority}
              </span>
            </Link>
          ))
        )}
      </div>
    </DashboardCard>
  );
}
