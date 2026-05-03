"use client";

import { useConfirmStore } from "../../store/confirmStore";

export function useConfirm() {
  const openConfirm = useConfirmStore((state) => state.openConfirm);
  return openConfirm;
}

export default function ConfirmModal() {
  const current = useConfirmStore((state) => state.current);
  const closeConfirm = useConfirmStore((state) => state.closeConfirm);

  if (!current) return null;

  const {
    title = "Are you sure?",
    description = "",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    loading = false,
  } = current;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4 sm:p-6 backdrop-blur-sm">
      <div className="mx-auto my-6 max-h-[calc(100vh-3rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
        {description ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p> : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={() => closeConfirm(false)}
            disabled={loading}
            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {cancelText}
          </button>
          <button
            onClick={() => closeConfirm(true)}
            disabled={loading}
            className={`w-full cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto ${
              variant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-violet-600 hover:bg-violet-700"
            }`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
