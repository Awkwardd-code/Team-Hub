"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToastStore } from "../../store/toastStore";
import { useNotificationStore } from "../../store/notificationStore";

export default function NotificationToastContainer() {
  const router = useRouter();
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);
  const markOneRead = useNotificationStore((state) => state.markOneRead);

  if (!toasts.length) return null;

  return (
    <div className="fixed left-4 right-4 top-4 z-[100] space-y-3 sm:left-auto sm:right-5 sm:top-5">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:w-80 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between gap-3">
            <button
              onClick={async () => {
                if (toast.notificationId) {
                  await markOneRead(toast.notificationId).catch(() => null);
                }
                dismissToast(toast.id);
                router.push(toast.link || "/notifications");
              }}
              className="flex-1 cursor-pointer text-left"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{toast.title}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{toast.message}</p>
            </button>
            <button
              onClick={() => dismissToast(toast.id)}
              className="cursor-pointer rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Close notification toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
