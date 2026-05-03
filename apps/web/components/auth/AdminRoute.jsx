"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import PageSkeleton from "../common/PageSkeleton";

export default function AdminRoute({ children }) {
  const router = useRouter();
  const { user, initialized, loading } = useAuthStore();

  useEffect(() => {
    if (initialized && !loading && !user) {
      router.replace("/login");
    }
  }, [initialized, loading, user, router]);

  if (!initialized || loading) {
    return <PageSkeleton />;
  }

  if (!user) {
    return null;
  }

  if (user.isAdmin !== true) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Access denied</h2>
          <p className="mt-2 text-sm text-slate-500">You need admin permissions to view this page.</p>
          <Link href="/dashboard" className="mt-6 inline-flex cursor-pointer rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
}