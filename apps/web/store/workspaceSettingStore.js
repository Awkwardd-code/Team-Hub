"use client";

import { create } from "zustand";
import { workspaceSettingApi } from "../features/workspace-settings/services/workspaceSettingApi";

export const useWorkspaceSettingStore = create((set) => ({
  settings: null,
  loading: false,
  error: "",

  fetchSettings: async (workspaceId) => {
    if (!workspaceId) return null;

    set({ loading: true, error: "" });

    try {
      const settings = await workspaceSettingApi.getSettings(workspaceId);
      set({ settings, loading: false });
      return settings;
    } catch (error) {
      set({ loading: false, error: error.message || "Failed to load settings" });
      return null;
    }
  },

  updateSettings: async (workspaceId, payload) => {
    if (!workspaceId) return null;

    set({ loading: true, error: "" });

    try {
      const settings = await workspaceSettingApi.updateSettings(workspaceId, payload);
      set({ settings, loading: false });
      return settings;
    } catch (error) {
      set({ loading: false, error: error.message || "Failed to update settings" });
      throw error;
    }
  },
}));
