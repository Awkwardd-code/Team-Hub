"use client";

import { ChevronDown } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardCard from "./DashboardCard";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { useMemo } from "react";

const EMPTY_TREND = [];
const FALLBACK_CHART_DATA = [{ day: "Mon", value: 0 }];

export default function GoalProgress() {
  const analytics = useAnalyticsStore((state) => state.analytics);
  const trend = analytics?.progressTrend || EMPTY_TREND;
  const data = useMemo(
    () => trend.map((item) => ({ day: item.name, value: item.progress || 0 })),
    [trend]
  );
  const chartData = data.length ? data : FALLBACK_CHART_DATA;

  return (
    <DashboardCard
      title="Goal Progress"
      className="h-full"
      action={
        <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600">
          This Week
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      }
    >
      <div className="h-[260px] rounded-xl border border-slate-100 bg-slate-50/60 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="goalProgressFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
            <Tooltip
              contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}
              labelStyle={{ color: "#334155", fontWeight: 600 }}
              formatter={(value) => [`${value}`, "Progress"]}
            />
            <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} fill="url(#goalProgressFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
