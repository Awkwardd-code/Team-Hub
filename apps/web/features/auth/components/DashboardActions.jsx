"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/authStore";

export default function DashboardActions() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const onLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="mb-4 flex w-full max-w-4xl justify-end">
      <button onClick={onLogout} className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
        Logout
      </button>
    </div>
  );
}
