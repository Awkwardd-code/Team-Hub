"use client";

import { MoreVertical, Users } from "lucide-react";

export default function WorkspaceCard({ workspace, onOpen, onManage, onDelete, opening = false }) {
  const isAdmin = workspace.myRole === "ADMIN";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div style={{ backgroundColor: workspace.accentColor }} className="h-2" />

      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{workspace.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
              {workspace.description || "No description added yet."}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => onDelete(workspace.id)}
              className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500"
            >
              <MoreVertical size={18} />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Users size={16} />
            <span>{workspace.memberCount} members</span>
          </div>

          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            workspace.myRole === "ADMIN"
              ? "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}>
            {workspace.myRole}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpen(workspace.id)}
            disabled={opening}
            className="w-full cursor-pointer rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            {opening ? "Opening..." : "Open Workspace"}
          </button>
          <button
            onClick={() => onManage(workspace.id)}
            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Manage Members
          </button>
        </div>
      </div>
    </div>
  );
}
