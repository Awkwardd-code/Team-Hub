"use client";

import { create } from "zustand";
import { announcementApi } from "../features/announcements/services/announcementApi";

function upsertById(list, item) {
  const exists = list.some((x) => x.id === item.id);
  if (exists) return list.map((x) => (x.id === item.id ? item : x));
  return [item, ...list];
}

export const useAnnouncementStore = create((set, get) => ({
  announcements: [],
  loading: false,
  error: "",

  fetchAnnouncements: async (workspaceId) => {
    set({ loading: true, error: "" });

    try {
      const announcements = await announcementApi.getAnnouncements(workspaceId);
      set({ announcements, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createAnnouncement: async (payload) => {
    const item = await announcementApi.createAnnouncement(payload);
    set({ announcements: upsertById(get().announcements, item) });
    return item;
  },

  updateAnnouncement: async (id, payload) => {
    const updated = await announcementApi.updateAnnouncement(id, payload);

    set({
      announcements: get().announcements.map((item) => (item.id === id ? updated : item)),
    });

    return updated;
  },

  deleteAnnouncement: async (id) => {
    await announcementApi.deleteAnnouncement(id);

    set({
      announcements: get().announcements.filter((item) => item.id !== id),
    });
  },

  createComment: async (id, payload) => {
    await announcementApi.createComment(id, payload);
    await get().fetchAnnouncements();
  },

  toggleReaction: async (id, emoji) => {
    const payload = await announcementApi.toggleReaction(id, emoji);
    if (payload?.announcement) {
      set({ announcements: upsertById(get().announcements, payload.announcement) });
      return payload.announcement;
    }
    await get().fetchAnnouncements();
  },

  addAnnouncementFromSocket: (announcement) => {
    set({ announcements: upsertById(get().announcements, announcement) });
  },

updateAnnouncementFromSocket: (announcement) => {
  set({ announcements: upsertById(get().announcements, announcement) });
},

deleteAnnouncementFromSocket: (id) => {
  set({
    announcements: get().announcements.filter((item) => item.id !== id),
  });
},

  addAnnouncementCommentFromSocket: ({ announcementId, comment }) => {
    set({
      announcements: get().announcements.map((item) =>
        item.id === announcementId
          ? {
              ...item,
              comments: (item.comments || []).some((c) => c.id === comment.id)
                ? item.comments || []
                : [...(item.comments || []), comment],
            }
          : item
      ),
    });
  },

  updateAnnouncementReactionFromSocket: ({ announcement }) => {
    if (!announcement?.id) return;
    set({ announcements: upsertById(get().announcements, announcement) });
  },
}));
