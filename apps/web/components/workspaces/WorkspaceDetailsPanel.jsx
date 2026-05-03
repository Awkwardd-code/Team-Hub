"use client";

import { X, UserPlus, Trash2 } from "lucide-react";

export default function WorkspaceDetailsPanel({
  workspace,
  onClose,
  onInvite,
  onEdit,
  onRoleChange,
  onRemove,
}) {
  if (!workspace) return null;

  const isAdmin = workspace.myRole === "ADMIN";

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/30 backdrop-blur-sm">
      <aside className="no-scrollbar h-full w-full max-w-xl overflow-y-auto bg-white p-4 shadow-2xl sm:p-6 dark:bg-slate-900">
        <div className="flex items-start justify-between">
          <div>
            <div
              style={{ backgroundColor: workspace.accentColor }}
              className="mb-3 h-3 w-16 rounded-full"
            />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{workspace.name}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {workspace.description || "No description available."}
            </p>
          </div>

          <button onClick={onClose} className="cursor-pointer rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200">
            <X size={20} />
          </button>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Members</h3>

          {isAdmin ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                onClick={onEdit}
                className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Edit Workspace
              </button>
              <button
                onClick={onInvite}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 sm:w-auto"
              >
                <UserPlus size={16} />
                Invite
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-4 space-y-3">
          {workspace.members?.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
                  {member.user.name?.charAt(0) || "U"}
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{member.user.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <select
                    value={member.role}
                    onChange={(e) => onRoleChange(member.id, e.target.value)}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MEMBER">Member</option>
                  </select>
                ) : (
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    member.role === "ADMIN"
                      ? "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}>
                    {member.role}
                  </span>
                )}

                {isAdmin && (
                  <button
                    onClick={() => onRemove(member.id)}
                    className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
