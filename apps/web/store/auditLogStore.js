"use client";

import { create } from "zustand";
import { auditLogApi } from "../features/audit-log/services/auditLogApi";

export const useAuditLogStore = create((set) => ({
  logs: [],
  loading: false,
  error: "",

  fetchLogs: async (filters = {}) => {
    set({ loading: true, error: "" });

    try {
      const logs = await auditLogApi.getLogs(filters);
      set({ logs, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));