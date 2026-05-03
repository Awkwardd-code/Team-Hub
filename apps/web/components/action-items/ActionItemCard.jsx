"use client";

import { Calendar, Goal, Pencil, Trash2, User } from "lucide-react";
import { ActionPriorityBadge, ActionStatusBadge } from "./ActionItemBadges";

export default function ActionItemCard({ item, onStatusChange, onDelete, onEdit }) {
  const overdue = item.dueDate && new Date(item.dueDate) < new Date() && item.status !== "DONE";

  return (
    <article
      className={`rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-slate-900 ${
        overdue ? "border-red-200 dark:border-red-900" : "border-slate-100 dark:border-slate-800"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <ActionStatusBadge status={item.status} />
          <ActionPriorityBadge priority={item.priority} />
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit(item)}
            className="cursor-pointer rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Pencil size={17} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="cursor-pointer rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{item.title}</h2>
      <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
        {item.description || "No description added."}
      </p>

      <div className="mt-5 space-y-3 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>{item.assignee?.name || "Unassigned"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Goal size={16} />
          <span>{item.goal?.title || "No parent goal"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span className={overdue ? "font-medium text-red-600 dark:text-red-300" : ""}>
            {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "No due date"}
          </span>
        </div>
      </div>

      <select
        value={item.status}
        onChange={(e) => onStatusChange(item.id, e.target.value)}
        className="mt-5 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      >
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
        <option value="BLOCKED">Blocked</option>
      </select>
    </article>
  );
}
