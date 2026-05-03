"use client";

import { create } from "zustand";

export const useConfirmStore = create((set) => ({
  current: null,

  openConfirm: (options) =>
    new Promise((resolve) => {
      set({
        current: {
          ...options,
          resolve,
          loading: false,
        },
      });
    }),

  closeConfirm: (result) => {
    set((state) => {
      if (state.current?.resolve) state.current.resolve(result);
      return { current: null };
    });
  },

  setConfirmLoading: (loading) => {
    set((state) =>
      state.current
        ? {
            current: {
              ...state.current,
              loading,
            },
          }
        : state
    );
  },
}));

