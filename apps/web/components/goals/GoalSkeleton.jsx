export default function GoalSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 h-5 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="mt-8 h-2 w-full animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}