export default function MilestoneSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 h-5 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-200" />
          <div className="mt-6 h-20 w-full animate-pulse rounded-2xl bg-slate-200" />
        </div>
      ))}
    </div>
  );
}