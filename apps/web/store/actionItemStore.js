"use client";

import { create } from "zustand";
import { actionItemApi } from "../features/action-items/services/actionItemApi";

function upsertById(list, item) {
  const exists = list.some((x) => x.id === item.id);
  if (exists) return list.map((x) => (x.id === item.id ? item : x));
  return [item, ...list];
}
export const useActionItemStore = create((set, get) => ({
  actionItems: [],
  loading: false,
  error: "",

  fetchActionItems: async (filters = {}) => {
    set({ loading: true, error: "" });

    try {
      const actionItems = await actionItemApi.getActionItems(filters);
      set({ actionItems, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createActionItem: async (payload) => {
    const item = await actionItemApi.createActionItem(payload);
    set({ actionItems: upsertById(get().actionItems, item) });
    return item;
  },

  updateActionItem: async (id, payload) => {
    const updated = await actionItemApi.updateActionItem(id, payload);

    set({
      actionItems: get().actionItems.map((item) => (item.id === id ? updated : item)),
    });

    return updated;
  },

  deleteActionItem: async (id) => {
    await actionItemApi.deleteActionItem(id);

    set({
      actionItems: get().actionItems.filter((item) => item.id !== id),
    });
  },

  addActionItemFromSocket: (item) => {
    set({ actionItems: upsertById(get().actionItems, item) });
  },

updateActionItemFromSocket: (item) => {
  set({ actionItems: upsertById(get().actionItems, item) });
},

deleteActionItemFromSocket: (id) => {
  set({
    actionItems: get().actionItems.filter((item) => item.id !== id),
  });
},
}));

