"use client";

import { create } from "zustand";
import { adminMemberApi } from "../features/admin-members/services/adminMemberApi";

export const useAdminMemberStore = create((set, get) => ({
  members: [],
  overview: null,
  loading: false,
  error: "",

  fetchMembers: async (workspaceId) => {
    if (!workspaceId) return;

    set({ loading: true, error: "" });

    try {
      const members = await adminMemberApi.getMembers(workspaceId);
      set({ members, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  inviteMember: async (workspaceId, payload) => {
    return adminMemberApi.inviteMember(workspaceId, payload);
  },

  fetchOverview: async () => {
    const overview = await adminMemberApi.getOverview();
    set({ overview });
    return overview;
  },

  updateMemberRole: async (workspaceId, memberId, role) => {
    const updated = await adminMemberApi.updateMemberRole(workspaceId, memberId, role);

    set({
      members: get().members.map((member) =>
        member.id === memberId ? updated : member
      ),
    });

    return updated;
  },

  removeMember: async (workspaceId, memberId) => {
    await adminMemberApi.removeMember(workspaceId, memberId);

    set({
      members: get().members.filter((member) => member.id !== memberId),
    });
  },
}));
