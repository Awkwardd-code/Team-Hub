import { ArrowUpRight, Target } from "lucide-react";
import DashboardCard from "./DashboardCard";

const goals = [
  { title: "Website Redesign", progress: 75 },
  { title: "Mobile App Launch", progress: 60 },
  { title: "Q2 Marketing Campaign", progress: 40 },
  { title: "Customer Onboarding Flow", progress: 25 },
];

export default function TopGoals() {
  return (
    <DashboardCard title="Top Goals" action={<button className="text-xs font-medium text-violet-600 hover:underline">View all</button>}>
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.title}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                  <Target className="h-3.5 w-3.5" />
                </span>
                <p className="truncate text-sm font-medium text-slate-800">{goal.title}</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">{goal.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: `${goal.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
