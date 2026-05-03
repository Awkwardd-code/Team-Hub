export default function AdminMembersSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />

      <div className="mt-8 space-y-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              <div>
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mt-2 h-3 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
            <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
