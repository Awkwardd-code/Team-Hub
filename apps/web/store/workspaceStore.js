"use client";

import { create } from "zustand";
import { workspaceApi } from "../features/workspaces/services/workspaceApi";

export const useWorkspaceStore = create((set, get) => ({
  workspaces: [],
  selectedWorkspace: null,
  loading: false,
  error: "",

  fetchWorkspaces: async () => {
    set({ loading: true, error: "" });
    try {
      const workspaces = await workspaceApi.getWorkspaces();
      set({ workspaces, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createWorkspace: async (payload) => {
    const workspace = await workspaceApi.createWorkspace(payload);
    set({ workspaces: [workspace, ...get().workspaces.filter((w) => w.id !== workspace.id)] });
    return workspace;
  },

  fetchWorkspace: async (id) => {
    set({ loading: true, error: "" });
    try {
      const workspace = await workspaceApi.getWorkspace(id);
      set({ selectedWorkspace: workspace, loading: false });
      return workspace;
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  updateWorkspace: async (id, payload) => {
    const workspace = await workspaceApi.updateWorkspace(id, payload);
    set({
      workspaces: get().workspaces.map((w) => (w.id === id ? { ...w, ...workspace } : w)),
      selectedWorkspace:
        get().selectedWorkspace?.id === id
          ? { ...get().selectedWorkspace, ...workspace }
          : get().selectedWorkspace,
    });
    return workspace;
  },

  deleteWorkspace: async (id) => {
    await workspaceApi.deleteWorkspace(id);
    set({
      selectedWorkspace: null,
      workspaces: get().workspaces.filter((w) => w.id !== id),
    });
  },

  inviteMember: async (id, payload) => {
    return workspaceApi.inviteMember(id, payload);
  },

  updateMemberRole: async (workspaceId, memberId, role) => {
    await workspaceApi.updateMemberRole(workspaceId, memberId, role);
    await get().fetchWorkspace(workspaceId);
  },

  removeMember: async (workspaceId, memberId) => {
    await workspaceApi.removeMember(workspaceId, memberId);
    await get().fetchWorkspace(workspaceId);
  },

  addWorkspaceFromSocket: (workspace) => {
    const exists = get().workspaces.some((item) => item.id === workspace.id);
    if (exists) {
      set({
        workspaces: get().workspaces.map((item) => (item.id === workspace.id ? { ...item, ...workspace } : item)),
      });
      return;
    }

    set({ workspaces: [workspace, ...get().workspaces] });
  },

  updateWorkspaceFromSocket: (workspace) => {
    set({
      workspaces: get().workspaces.map((item) => (item.id === workspace.id ? { ...item, ...workspace } : item)),
      selectedWorkspace:
        get().selectedWorkspace?.id === workspace.id
          ? { ...get().selectedWorkspace, ...workspace }
          : get().selectedWorkspace,
    });
  },

  deleteWorkspaceFromSocket: (id) => {
    set({
      workspaces: get().workspaces.filter((item) => item.id !== id),
      selectedWorkspace: get().selectedWorkspace?.id === id ? null : get().selectedWorkspace,
    });
  },

  setSelectedWorkspace: (workspace) => set({ selectedWorkspace: workspace }),
}));
