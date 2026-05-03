"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#7c3aed", "#22c55e", "#0ea5e9", "#f59e0b", "#ef4444", "#64748b"];

export default function StatusDonutChart({ title, subtitle, data = [] }) {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
            >
              {chartData.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {chartData.map((item, index) => (
          <div key={`${item.name}-${index}`} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
