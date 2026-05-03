"use client";

import { create } from "zustand";

export const usePresenceStore = create((set) => ({
  onlineUsersByWorkspace: {},
  activeWorkspaceId: "",

  setOnlineUsers: (workspaceId, users, count) => {
    if (!workspaceId) return;
    const safeUsers = Array.isArray(users) ? users : [];
    set((state) => ({
      activeWorkspaceId: workspaceId,
      onlineUsersByWorkspace: {
        ...state.onlineUsersByWorkspace,
        [workspaceId]: {
          users: safeUsers,
          count: typeof count === "number" ? count : safeUsers.length,
        },
      },
    }));
  },

  clearOnlineUsers: () => {
    set({ onlineUsersByWorkspace: {}, activeWorkspaceId: "" });
  },
}));
