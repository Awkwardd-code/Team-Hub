"use client";

import { useMemo, useState } from "react";
import NotificationEmptyState from "./NotificationEmptyState";
import NotificationFilters from "./NotificationFilters";
import NotificationItem from "./NotificationItem";

export default function NotificationList({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onAcceptInvitation,
  onDeclineInvitation,
  onOpen,
  loading = false,
}) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(() => {
    if (activeFilter === "All") return notifications;
    if (activeFilter === "Unread") return notifications.filter((n) => n.read !== true);
    if (activeFilter === "Mentions") return notifications.filter((n) => ["mention", "goal_mention"].includes(n.type));
    if (activeFilter === "Roles")
      return notifications.filter((n) =>
        ["role", "role_update", "workspace_invite", "workspace_invite_accepted", "workspace_invite_declined"].includes(n.type)
      );
    if (activeFilter === "Tasks") return notifications.filter((n) => n.type === "task");
    if (activeFilter === "Announcements")
      return notifications.filter((n) => ["announcement", "announcement_comment", "announcement_reaction"].includes(n.type));
    return notifications;
  }, [activeFilter, notifications]);

  const unreadCount = notifications.filter((n) => n.read !== true).length;

  return (
    <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <NotificationFilters activeFilter={activeFilter} onChange={setActiveFilter} />
        <button
          onClick={onMarkAllRead}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Mark all as read {unreadCount > 0 ? `(${unreadCount})` : ""}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 p-6" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <NotificationEmptyState />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <NotificationItem
              key={item.id}
              item={item}
              onMarkRead={onMarkRead}
              onOpen={onOpen}
              onAcceptInvitation={onAcceptInvitation}
              onDeclineInvitation={onDeclineInvitation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
