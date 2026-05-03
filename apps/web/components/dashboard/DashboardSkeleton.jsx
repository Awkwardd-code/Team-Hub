import Skeleton from "../ui/Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="h-full overflow-y-auto">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="mt-5 h-10 w-full" />
          <div className="mt-5 space-y-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </div>

      <main className="px-4 py-6 sm:px-6 lg:pl-[19rem] lg:pr-8">
        <Skeleton className="h-16 w-full" />
        <div className="mt-6 space-y-6">
          <Skeleton className="h-8 w-72" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Skeleton className="h-64 w-full xl:col-span-2" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </main>
    </div>
  );
}
