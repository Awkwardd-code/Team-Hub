"use client";

import { Calendar, Trash2 } from "lucide-react";
import { ActionPriorityBadge } from "./ActionItemBadges";

export default function ActionItemsList({ items, onStatusChange, onDelete, onEdit }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="hidden grid-cols-12 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 md:grid">
        <div className="col-span-4">Task</div>
        <div className="col-span-2">Assignee</div>
        <div className="col-span-2">Priority</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Due</div>
        <div className="col-span-1 text-right">Action</div>
      </div>

      {items.map((item) => (
        <div key={item.id} className="grid gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 md:grid-cols-12 md:items-center md:px-5 dark:border-slate-800">
          <div className="col-span-4">
            <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
            <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{item.description || "No description"}</p>
          </div>

          <div className="col-span-2 text-sm text-slate-600 dark:text-slate-300">{item.assignee?.name || "Unassigned"}</div>

          <div className="col-span-2">
            <ActionPriorityBadge priority={item.priority} />
          </div>

          <div className="col-span-2">
            <select
              value={item.status}
              onChange={(e) => onStatusChange(item.id, e.target.value)}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>

          <div className="col-span-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <Calendar size={14} />
            {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "-"}
          </div>

          <div className="col-span-1">
            <div className="flex justify-start gap-1 md:justify-end">
              <button onClick={() => onEdit(item)} className="cursor-pointer rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                Edit
              </button>
              <button onClick={() => onDelete(item.id)} className="cursor-pointer rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
