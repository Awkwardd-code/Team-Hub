"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import DashboardCard from "./DashboardCard";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { useMemo } from "react";
const COLOR_BY_NAME = {
  Done: "#10b981",
  "In Progress": "#0ea5e9",
  "To Do": "#8b5cf6",
  Blocked: "#f97316",
};
const EMPTY_STATUS = [];

export default function TasksByStatus() {
  const analytics = useAnalyticsStore((state) => state.analytics);
  const source = analytics?.actionItemStatus || EMPTY_STATUS;
  const data = useMemo(
    () => source.map((item) => ({ ...item, color: COLOR_BY_NAME[item.name] || "#64748b" })),
    [source]
  );
  const total = useMemo(
    () => data.reduce((sum, item) => sum + (item.value || 0), 0),
    [data]
  );

  return (
    <DashboardCard title="Tasks by Status" className="h-full">
      <div className="flex h-[260px] flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={68}
                stroke="none"
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}
                formatter={(value) => [`${value}`, "Status"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none -mt-[98px] flex flex-col items-center justify-center text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{total}</p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm dark:bg-slate-900">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
