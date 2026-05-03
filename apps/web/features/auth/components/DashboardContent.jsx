"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore";

export default function DashboardContent() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  return (
    <section className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-slate-600">Welcome back, {user.name}</p>
      <p className="text-sm text-slate-500">{user.email}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="font-medium">Workspace Module</h2>
          <p className="mt-1 text-sm text-slate-600">Placeholder for team workspace controls.</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="font-medium">Goals Module</h2>
          <p className="mt-1 text-sm text-slate-600">Placeholder for milestones and goals.</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="font-medium">Socket Module</h2>
          <p className="mt-1 text-sm text-slate-600">Placeholder for realtime collaboration.</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h2 className="font-medium">Analytics Module</h2>
          <p className="mt-1 text-sm text-slate-600">Placeholder for activity analytics.</p>
        </div>
      </div>
    </section>
  );
}
