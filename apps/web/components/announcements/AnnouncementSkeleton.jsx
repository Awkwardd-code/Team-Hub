export default function AnnouncementSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 h-10 w-32 animate-pulse rounded-xl bg-slate-200" />
        </div>
      ))}
    </div>
  );
}