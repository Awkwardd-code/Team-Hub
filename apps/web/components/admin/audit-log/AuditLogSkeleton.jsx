export default function AuditLogSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-200" />

      <div className="mt-8 space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="rounded-2xl border border-slate-100 p-4">
            <div className="h-4 w-52 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-3 w-80 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}