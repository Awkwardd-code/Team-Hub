"use client";

import { useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { connectSocket } from "../../lib/socket";

export default function DashboardClient() {
  const { count, increment } = useAppStore();

  useEffect(() => {
    const socket = connectSocket();
    return () => socket.disconnect();
  }, []);

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-[var(--card)] p-6 shadow-sm">
      <h2 className="text-xl font-medium">Client Demo</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-300">Zustand count: {count}</p>
      <button
        type="button"
        onClick={increment}
        className="mt-4 rounded-xl bg-[var(--accent)] px-4 py-2 text-white transition hover:opacity-90"
      >
        Increment
      </button>
    </section>
  );
}
