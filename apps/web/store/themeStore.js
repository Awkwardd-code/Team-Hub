"use client";

import { create } from "zustand";

const STORAGE_KEY = "theme";
const LEGACY_STORAGE_KEY = "teamhub-theme";

function applyTheme(theme) {
  if (typeof window === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export const useThemeStore = create((set, get) => ({
  theme: "light",

  initTheme: () => {
    if (typeof window === "undefined") return;
    const savedTheme =
      window.localStorage.getItem(STORAGE_KEY) ||
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    const nextTheme = savedTheme === "dark" ? "dark" : "light";
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    set({ theme: nextTheme });
    applyTheme(nextTheme);
  },

  setTheme: (theme) => {
    const nextTheme = theme === "dark" ? "dark" : "light";
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    }
    set({ theme: nextTheme });
    applyTheme(nextTheme);
  },

  toggleTheme: () => {
    const current = get().theme;
    get().setTheme(current === "dark" ? "light" : "dark");
  },
}));
