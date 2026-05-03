"use client";

import { Trash2 } from "lucide-react";

export default function AdminMembersTable({ members, onRoleChange, onRemove }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 p-6 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Workspace Members</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage access levels and workspace permissions.
        </p>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {members.map((member) => (
          <div
            key={member.id}
            className="grid gap-4 p-4 md:grid-cols-[1fr_160px_120px] md:p-5"
          >
            <div className="flex items-center gap-3">
              {member.user.avatarUrl ? (
                <img
                  src={member.user.avatarUrl}
                  alt={member.user.name}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
                  {member.user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900 dark:text-white">{member.user.name}</p>
                <p className="truncate text-sm text-slate-500 dark:text-slate-400">{member.user.email}</p>
              </div>
            </div>

            <select
              value={member.role}
              onChange={(e) => onRoleChange(member.id, e.target.value)}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
            </select>

            <button
              onClick={() => onRemove(member.id)}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
