"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import DashboardSkeleton from "../dashboard/DashboardSkeleton";
import NotificationsSkeleton from "../notifications/NotificationsSkeleton";
import ProfileSkeleton from "../profile/ProfileSkeleton";
import PageSkeleton from "../common/PageSkeleton";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, initialized, loading, initializeAuth } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initializeAuth();
    }
  }, [initialized, initializeAuth]);

  useEffect(() => {
    if (initialized && !loading && !user) {
      router.replace("/login");
    }
  }, [initialized, loading, user, router]);

  if (!initialized || loading) {
    if (pathname?.startsWith("/dashboard")) return <DashboardSkeleton />;
    if (pathname?.startsWith("/profile")) return <ProfileSkeleton />;
    if (pathname?.startsWith("/notifications")) return <NotificationsSkeleton />;
    return <PageSkeleton />;
  }

  if (!user) return null;

  return children;
}