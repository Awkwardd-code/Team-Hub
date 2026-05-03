"use client";

import { create } from "zustand";
import { goalApi } from "../features/goals/services/goalApi";

function upsertById(list, item) {
  const exists = list.some((x) => x.id === item.id);
  if (exists) return list.map((x) => (x.id === item.id ? item : x));
  return [item, ...list];
}
export const useGoalStore = create((set, get) => ({
  goals: [],
  loading: false,
  error: "",

  fetchGoals: async (workspaceId) => {
    set({ loading: true, error: "" });

    try {
      const goals = await goalApi.getGoals(workspaceId);
      set({ goals, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createGoal: async (payload) => {
    const goal = await goalApi.createGoal(payload);
    set({ goals: upsertById(get().goals, goal) });
    return goal;
  },

  updateGoal: async (id, payload) => {
    const updated = await goalApi.updateGoal(id, payload);

    set({
      goals: get().goals.map((goal) => (goal.id === id ? updated : goal)),
    });

    return updated;
  },

  deleteGoal: async (id) => {
    await goalApi.deleteGoal(id);

    set({
      goals: get().goals.filter((goal) => goal.id !== id),
    });
  },

  createMilestone: async (goalId, payload) => {
    await goalApi.createMilestone(goalId, payload);
    await get().fetchGoals();
  },

  createGoalUpdate: async (goalId, payload) => {
    const update = await goalApi.createGoalUpdate(goalId, payload);
    set({
      goals: get().goals.map((goal) =>
        goal.id === goalId ? { ...goal, updates: [update, ...(goal.updates || [])] } : goal
      ),
    });
    return update;
  },

  addGoalFromSocket: (goal) => {
    set({ goals: upsertById(get().goals, goal) });
  },

updateGoalFromSocket: (goal) => {
  set({ goals: upsertById(get().goals, goal) });
},

deleteGoalFromSocket: (id) => {
  set({
    goals: get().goals.filter((item) => item.id !== id),
  });
},

addGoalUpdateFromSocket: ({ goalId, update }) => {
  if (!goalId || !update?.id) return;
  set({
    goals: get().goals.map((goal) => {
      if (goal.id !== goalId) return goal;
      const exists = (goal.updates || []).some((item) => item.id === update.id);
      if (exists) return goal;
      return { ...goal, updates: [update, ...(goal.updates || [])] };
    }),
  });
},
}));


