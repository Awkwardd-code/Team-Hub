"use client";

import { Target } from "lucide-react";

export default function EmptyGoalsState({ onCreate }) {
  return (
    <div className="rounded-3xl border border-dashed border-violet-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
        <Target size={28} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-slate-900">No goals yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Create your first goal and start tracking progress with your workspace.
      </p>

      <button
        onClick={onCreate}
        className="mt-6 cursor-pointer rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
      >
        Create Goal
      </button>
    </div>
  );
}