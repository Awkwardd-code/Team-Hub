export default function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="mt-5 h-8 w-20 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-3 w-32 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-80 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="h-full animate-pulse rounded-2xl bg-slate-200" />
        </div>
        <div className="h-80 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="h-full animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}