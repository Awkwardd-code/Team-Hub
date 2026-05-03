import Skeleton from "../ui/Skeleton";

export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-5 w-96" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}