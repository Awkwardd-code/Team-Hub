"use client";

import { Calendar, Flag, Pencil, Trash2, User } from "lucide-react";
import MilestoneStatusBadge from "./MilestoneStatusBadge";

export default function MilestoneCard({ milestone, onProgressChange, onStatusChange, onDelete, onEdit }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <MilestoneStatusBadge status={milestone.status} />
          <h2 className="mt-4 text-lg font-bold text-slate-900">{milestone.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
            {milestone.description || "No description added."}
          </p>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit(milestone)}
            className="cursor-pointer rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(milestone.id)}
            className="cursor-pointer rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Progress</span>
          <span className="font-bold text-violet-700">{milestone.progress}%</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={milestone.progress}
          onChange={(e) => onProgressChange(milestone.id, Number(e.target.value))}
          className="mt-3 w-full cursor-pointer accent-violet-600"
        />

        <div className="mt-2 h-2 rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-violet-600"
            style={{ width: `${milestone.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-500 md:grid-cols-2">
        <div className="flex items-center gap-2">
          <Flag size={16} />
          <span>{milestone.goal?.title || "Unknown goal"}</span>
        </div>

        <div className="flex items-center gap-2">
          <User size={16} />
          <span>{milestone.owner?.name || "Unassigned"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>
            {milestone.dueDate
              ? new Date(milestone.dueDate).toLocaleDateString()
              : "No due date"}
          </span>
        </div>

        <select
          value={milestone.status}
          onChange={(e) => onStatusChange(milestone.id, e.target.value)}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>
    </article>
  );
}
