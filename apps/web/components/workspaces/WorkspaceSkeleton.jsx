export default function WorkspaceSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-4 h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-8 h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}
