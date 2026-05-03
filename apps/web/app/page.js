"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import Skeleton from "../components/ui/Skeleton";

export default function HomePage() {
  const router = useRouter();
  const { initialized, loading, user, initializeAuth } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initializeAuth();
    }
  }, [initialized, initializeAuth]);

  useEffect(() => {
    if (!initialized || loading) return;
    router.replace(user ? "/dashboard" : "/login");
  }, [initialized, loading, user, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-sm space-y-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-4/5" />
      </div>
    </main>
  );
}
