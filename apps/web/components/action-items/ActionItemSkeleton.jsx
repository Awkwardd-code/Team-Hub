export default function ActionItemSkeleton() {
  return (
    <div className="grid gap-5 xl:grid-cols-4">
      {[1, 2, 3, 4].map((column) => (
        <div key={column} className="rounded-3xl bg-slate-100/70 p-4">
          <div className="mb-4 h-5 w-28 animate-pulse rounded bg-slate-200" />
          <div className="space-y-4">
            {[1, 2].map((card) => (
              <div key={card} className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
                <div className="mt-5 h-5 w-full animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-slate-200" />
                <div className="mt-6 h-10 w-full animate-pulse rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}