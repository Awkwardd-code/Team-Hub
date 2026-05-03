"use client";

import { create } from "zustand";
import { milestoneApi } from "../features/milestones/services/milestoneApi";

function upsertById(list, item) {
  const exists = list.some((x) => x.id === item.id);
  if (exists) return list.map((x) => (x.id === item.id ? item : x));
  return [item, ...list];
}
export const useMilestoneStore = create((set, get) => ({
  milestones: [],
  loading: false,
  error: "",

  fetchMilestones: async (filters = {}) => {
    set({ loading: true, error: "" });

    try {
      const milestones = await milestoneApi.getMilestones(filters);
      set({ milestones, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createMilestone: async (payload) => {
    const milestone = await milestoneApi.createMilestone(payload);
    set({ milestones: upsertById(get().milestones, milestone) });
    return milestone;
  },

  updateMilestone: async (id, payload) => {
    const updated = await milestoneApi.updateMilestone(id, payload);

    set({
      milestones: get().milestones.map((item) => (item.id === id ? updated : item)),
    });

    return updated;
  },

  deleteMilestone: async (id) => {
    await milestoneApi.deleteMilestone(id);

    set({
      milestones: get().milestones.filter((item) => item.id !== id),
    });
  },

  addMilestoneFromSocket: (milestone) => {
    set({ milestones: upsertById(get().milestones, milestone) });
  },

updateMilestoneFromSocket: (milestone) => {
  set({ milestones: upsertById(get().milestones, milestone) });
},

deleteMilestoneFromSocket: (id) => {
  set({
    milestones: get().milestones.filter((item) => item.id !== id),
  });
},
}));

