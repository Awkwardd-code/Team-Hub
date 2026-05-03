"use client";

import { Building2 } from "lucide-react";

export default function EmptyWorkspaceState({ onCreate }) {
  return (
    <div className="rounded-3xl border border-dashed border-violet-200 bg-white p-10 text-center shadow-sm dark:border-violet-900 dark:bg-slate-900">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
        <Building2 size={28} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">No workspaces yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Create your first workspace to start managing goals, action items, and team collaboration.
      </p>

      <button
        onClick={onCreate}
        className="mt-6 cursor-pointer rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
      >
        Create Workspace
      </button>
    </div>
  );
}
