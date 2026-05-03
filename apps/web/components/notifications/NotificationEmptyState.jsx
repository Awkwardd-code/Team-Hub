import { Bell } from "lucide-react";

export default function NotificationEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
        <Bell className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">No notifications found</h3>
      <p className="mt-1 text-sm text-slate-500">Try a different filter or check back later.</p>
    </div>
  );
}