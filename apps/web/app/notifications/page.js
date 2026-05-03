"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "../../components/dashboard/DashboardShell";
import NotificationList from "../../components/notifications/NotificationList";
import { useNotificationStore } from "../../store/notificationStore";
import { useWorkspaceStore } from "../../store/workspaceStore";

export default function NotificationsPage() {
  const router = useRouter();
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const { notifications, fetchNotifications, markOneRead, markAllRead, loading, acceptInvitation, declineInvitation } =
    useNotificationStore();
  const { fetchWorkspaces } = useWorkspaceStore();

  useEffect(() => {
    fetchWorkspaces();
    fetchNotifications();
  }, [fetchWorkspaces, fetchNotifications]);

  const handleAcceptInvitation = async (invitationId, notificationId) => {
    setActionError("");
    setActionSuccess("");
    try {
      await acceptInvitation(invitationId, notificationId);
      await fetchWorkspaces();
      setActionSuccess("Invitation accepted.");
    } catch (error) {
      setActionError(error?.message || "Failed to accept invitation.");
    }
  };

  const handleDeclineInvitation = async (invitationId, notificationId) => {
    setActionError("");
    setActionSuccess("");
    try {
      await declineInvitation(invitationId, notificationId);
      setActionSuccess("Invitation declined.");
    } catch (error) {
      setActionError(error?.message || "Failed to decline invitation.");
    }
  };

  const openNotification = async (notification) => {
    if (notification.read !== true) {
      await markOneRead(notification.id).catch(() => null);
    }
    router.push(notification.link || "/notifications");
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Stay updated on mentions, roles, tasks, and workspace activity.</p>
        </header>
        {actionError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        ) : null}
        {actionSuccess ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {actionSuccess}
          </div>
        ) : null}

        <NotificationList
          notifications={notifications}
          onMarkRead={markOneRead}
          onMarkAllRead={markAllRead}
          onAcceptInvitation={handleAcceptInvitation}
          onDeclineInvitation={handleDeclineInvitation}
          onOpen={openNotification}
          loading={loading}
        />
      </div>
    </DashboardShell>
  );
}
