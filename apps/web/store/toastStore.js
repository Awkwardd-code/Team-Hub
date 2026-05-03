"use client";

import { create } from "zustand";

const TOAST_DURATION_MS = 30_000;

export const useToastStore = create((set, get) => ({
  toasts: [],

  showNotificationToast: (notification) => {
    if (!notification?.id) return;
    const toastId = `notification-${notification.id}`;
    const exists = get().toasts.some((toast) => toast.id === toastId);
    if (exists) return;

    const timeoutId = setTimeout(() => {
      get().dismissToast(toastId);
    }, TOAST_DURATION_MS);

    set((state) => ({
      toasts: [
        {
          id: toastId,
          notificationId: notification.id,
          title: notification.title || "New notification",
          message: notification.message || "",
          link: notification.link || "/notifications",
          createdAt: notification.createdAt || new Date().toISOString(),
          timeoutId,
        },
        ...state.toasts,
      ],
    }));
  },

  dismissToast: (toastId) => {
    const toast = get().toasts.find((item) => item.id === toastId);
    if (toast?.timeoutId) clearTimeout(toast.timeoutId);
    set((state) => ({
      toasts: state.toasts.filter((item) => item.id !== toastId),
    }));
  },

  clearToasts: () => {
    get().toasts.forEach((toast) => {
      if (toast.timeoutId) clearTimeout(toast.timeoutId);
    });
    set({ toasts: [] });
  },
}));

