"use client";

import { Calendar, MoreVertical, Trash2, User } from "lucide-react";
import { useState } from "react";
import GoalStatusBadge from "./GoalStatusBadge";
import MentionTextarea from "../common/MentionTextarea";

export default function GoalCard({ goal, onEdit, onDelete, onCreateUpdate, members = [] }) {
  const [updateText, setUpdateText] = useState("");
  const progress =
    goal.milestones?.length > 0
      ? Math.round(
          goal.milestones.reduce((total, item) => total + item.progress, 0) /
            goal.milestones.length
        )
      : goal.status === "COMPLETED"
        ? 100
        : 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <GoalStatusBadge status={goal.status} />
          <h3 className="mt-4 text-lg font-bold text-slate-900">{goal.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
            {goal.description || "No description added."}
          </p>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit(goal)}
            className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <MoreVertical size={18} />
          </button>

          <button
            onClick={() => onDelete(goal.id)}
            className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Progress</span>
          <span className="font-semibold text-violet-700">{progress}%</span>
        </div>

        <div className="h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-violet-600"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>{goal.owner?.name || "Unknown"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : "No due date"}</span>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-800">Updates</p>
        <div className="mt-3 space-y-2">
          {(goal.updates || []).slice(0, 4).map((update) => (
            <div key={update.id} className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-700">{update.user?.name || "Member"}</p>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{update.content}</p>
            </div>
          ))}
        </div>

        <form
          className="mt-3 space-y-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!updateText.trim()) return;
            await onCreateUpdate?.(goal.id, { content: updateText });
            setUpdateText("");
          }}
        >
          <MentionTextarea
            value={updateText}
            onChange={setUpdateText}
            members={members}
            placeholder="Post a goal update and mention teammates..."
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button className="rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700">
            Post Update
          </button>
        </form>
      </div>
    </div>
  );
}
