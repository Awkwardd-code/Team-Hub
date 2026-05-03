export default function SettingsSkeleton() {
  return (
    <div className="space-y-5 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 w-72 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />

      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}
