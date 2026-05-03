"use client";

import { create } from "zustand";
import { notificationApi } from "../features/notifications/services/notificationApi";
import { invitationApi } from "../features/invitations/services/invitationApi";

function upsertById(list, item) {
  const exists = list.some((x) => x.id === item.id);
  if (exists) return list.map((x) => (x.id === item.id ? item : x));
  return [item, ...list];
}
export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  error: "",

  fetchNotifications: async () => {
    set({ loading: true, error: "" });
    try {
      const notifications = await notificationApi.getNotifications();
      set({ notifications, loading: false });
    } catch (error) {
      set({ loading: false, error: error.message || "Failed to load notifications" });
    }
  },

  addNotificationFromSocket: (notification) => {
    set({ notifications: upsertById(get().notifications, notification) });
  },

  markOneRead: async (id) => {
    await notificationApi.markRead(id);
    set({
      notifications: get().notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item
      ),
    });
  },

  markAllRead: async () => {
    await notificationApi.markAllRead();
    set({ notifications: get().notifications.map((item) => ({ ...item, read: true })) });
  },

  markAsRead: async (id) => get().markOneRead(id),

  setInvitationNotificationStatus: (notificationId, status) => {
    set({
      notifications: get().notifications.map((item) => {
        if (item.id !== notificationId) return item;
        return {
          ...item,
          read: true,
          metadata: {
            ...(item.metadata || {}),
            status,
          },
        };
      }),
    });
  },

  acceptInvitation: async (invitationId, notificationId) => {
    await invitationApi.acceptInvitation(invitationId);
    if (notificationId) {
      get().setInvitationNotificationStatus(notificationId, "ACCEPTED");
      await get().markOneRead(notificationId);
    }
  },

  declineInvitation: async (invitationId, notificationId) => {
    await invitationApi.declineInvitation(invitationId);
    if (notificationId) {
      get().setInvitationNotificationStatus(notificationId, "DECLINED");
      await get().markOneRead(notificationId);
    }
  },

  unreadCount: () => get().notifications.filter((item) => item.read !== true).length,
}));

