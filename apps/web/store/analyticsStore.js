"use client";

import { create } from "zustand";
import { analyticsApi } from "../features/analytics/services/analyticsApi";

export const useAnalyticsStore = create((set) => ({
  analytics: null,
  loading: false,
  error: "",

  fetchAnalytics: async (workspaceId = "") => {
    set({ loading: true, error: "" });

    try {
      const analytics = await analyticsApi.getOverview(workspaceId || undefined);
      set({ analytics, loading: false });
      return analytics;
    } catch (error) {
      set({ loading: false, error: error.message || "Failed to load analytics" });
      return null;
    }
  },
}));
