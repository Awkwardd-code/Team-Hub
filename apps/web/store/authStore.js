"use client";

import { create } from "zustand";
import { authApi } from "../features/auth/services/authApi";
import { getSocket } from "../lib/socket";
import { useNotificationStore } from "./notificationStore";
import { usePresenceStore } from "./presenceStore";
import { useWorkspaceStore } from "./workspaceStore";
import { useToastStore } from "./toastStore";

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    isAdmin: user.isAdmin === true,
  };
}

export const useAuthStore = create((set) => ({
  user: null,
  initialized: false,
  loading: false,
  error: "",

  setUser: (user) => set({ user: normalizeUser(user) }),
  clearUser: () => set({ user: null, initialized: true, loading: false, error: "" }),
  setError: (error) => set({ error }),

  initializeAuth: async () => {
    set({ loading: true, error: "" });
    try {
      const data = await authApi.me();
      const user = normalizeUser(data.user);
      set({ user, initialized: true, loading: false });
      return user;
    } catch (error) {
      set({ user: null, initialized: true, loading: false, error: error.message });
      return null;
    }
  },

  logout: async () => {
    await authApi.logout().catch(() => null);
    useNotificationStore.setState({ notifications: [], loading: false, error: "" });
    usePresenceStore.getState().clearOnlineUsers();
    useWorkspaceStore.setState({
      workspaces: [],
      selectedWorkspace: null,
      loading: false,
      error: "",
    });
    useToastStore.getState().clearToasts();
    const socket = getSocket();
    socket.removeAllListeners();
    socket.disconnect();
    set({ user: null, initialized: true, loading: false, error: "" });
  },
}));
