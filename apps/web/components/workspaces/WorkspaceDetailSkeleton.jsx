"use client";

export default function WorkspaceDetailSkeleton() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-3 h-4 w-96 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </section>

      <section className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-3 h-7 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </section>

      {Array.from({ length: 4 }).map((_, index) => (
        <section key={index} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-4 space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </section>
      ))}
    </div>
  );
}

