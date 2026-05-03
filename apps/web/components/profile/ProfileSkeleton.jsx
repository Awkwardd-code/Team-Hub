import Skeleton from "../ui/Skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <div className="space-y-8">
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <Skeleton className="h-5 w-32" />
            <div className="flex items-center gap-6">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-4 w-52" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}