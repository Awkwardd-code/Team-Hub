"use client";

import DashboardShell from "../../components/dashboard/DashboardShell";
import ProfileForm from "../../components/profile/ProfileForm";
import ProfileHeader from "../../components/profile/ProfileHeader";
import { useAuthStore } from "../../store/authStore";

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <ProfileHeader />
        <ProfileForm user={user} />
      </div>
    </DashboardShell>
  );
}
