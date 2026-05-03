"use client";

import Link from "next/link";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useGoalStore } from "../../store/goalStore";
import { useMilestoneStore } from "../../store/milestoneStore";
import { useActionItemStore } from "../../store/actionItemStore";
import { useAnnouncementStore } from "../../store/announcementStore";
import ThemeToggle from "./ThemeToggle";

function initials(name) {
  return (name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("");
}

export default function DashboardNavbar({ onOpenMobileMenu = () => {}, onCloseMobileMenu = () => {} }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { notifications, fetchNotifications, markOneRead, markAllRead, loading } =
    useNotificationStore();
  const unreadCount = notifications.filter((n) => n.read !== true).length;
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const selectedWorkspace = useWorkspaceStore((s) => s.selectedWorkspace);
  const fetchWorkspaces = useWorkspaceStore((s) => s.fetchWorkspaces);
  const goals = useGoalStore((s) => s.goals);
  const fetchGoals = useGoalStore((s) => s.fetchGoals);
  const milestones = useMilestoneStore((s) => s.milestones);
  const fetchMilestones = useMilestoneStore((s) => s.fetchMilestones);
  const actionItems = useActionItemStore((s) => s.actionItems);
  const fetchActionItems = useActionItemStore((s) => s.fetchActionItems);
  const announcements = useAnnouncementStore((s) => s.announcements);
  const fetchAnnouncements = useAnnouncementStore((s) => s.fetchAnnouncements);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setProfileOpen(false);
      setNotificationOpen(false);
    };
    const onPointerDown = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setNotificationOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearch("");
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationOpen(false);
        setSearch("");
        onCloseMobileMenu();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    fetchNotifications();
    if (workspaces.length === 0) fetchWorkspaces();
    if (goals.length === 0) fetchGoals();
    if (milestones.length === 0) fetchMilestones();
    if (actionItems.length === 0) fetchActionItems();
    if (announcements.length === 0) fetchAnnouncements();
  }, [
    fetchNotifications,
    fetchWorkspaces,
    workspaces.length,
    fetchGoals,
    goals.length,
    fetchMilestones,
    milestones.length,
    fetchActionItems,
    actionItems.length,
    fetchAnnouncements,
    announcements.length,
  ]);

  const latestNotifications = notifications.slice(0, 5);

  const results = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    if (!q) return [];

    const makeResult = (type, id, title, description, href) => ({
      key: `${type}-${id}`,
      type,
      title,
      description,
      href,
    });

    return [
      ...workspaces.filter((item) => `${item.name} ${item.description || ""}`.toLowerCase().includes(q)).map((item) =>
        makeResult("workspace", item.id, item.name, item.description || "Workspace", `/workspaces/${item.id}`)
      ),
      ...goals.filter((item) => `${item.title} ${item.description || ""}`.toLowerCase().includes(q)).map((item) =>
        makeResult("goal", item.id, item.title, item.description || "Goal", `/goals?workspaceId=${item.workspaceId}`)
      ),
      ...milestones
        .filter((item) => `${item.title} ${item.description || ""}`.toLowerCase().includes(q))
        .map((item) =>
          makeResult(
            "milestone",
            item.id,
            item.title,
            item.description || "Milestone",
            `/milestones?goalId=${item.goalId || ""}`
          )
        ),
      ...actionItems
        .filter((item) => `${item.title} ${item.description || ""}`.toLowerCase().includes(q))
        .map((item) =>
          makeResult(
            "action-item",
            item.id,
            item.title,
            item.description || "Action item",
            `/action-items?workspaceId=${item.workspaceId || selectedWorkspace?.id || ""}`
          )
        ),
      ...announcements
        .filter((item) => `${item.title} ${item.content || ""}`.toLowerCase().includes(q))
        .map((item) =>
          makeResult(
            "announcement",
            item.id,
            item.title,
            item.content || "Announcement",
            `/announcements?workspaceId=${item.workspaceId || selectedWorkspace?.id || ""}`
          )
        ),
      ...((selectedWorkspace?.members || [])
        .filter((member) =>
          `${member.user?.name || ""} ${member.user?.email || ""}`.toLowerCase().includes(q)
        )
        .map((member) =>
          makeResult(
            "member",
            member.id,
            member.user?.name || member.user?.email || "Member",
            member.user?.email || "Workspace member",
            `/workspaces/${selectedWorkspace.id}`
          )
        )),
    ].slice(0, 8);
  }, [deferredSearch, workspaces, goals, milestones, actionItems, announcements, selectedWorkspace?.id]);

  const onLogout = async () => {
    setProfileOpen(false);
    await logout();
    router.replace("/login");
  };

  const openNotification = async (notification) => {
    if (notification.read !== true) {
      await markOneRead(notification.id).catch(() => null);
    }
    setNotificationOpen(false);
    router.push(notification.link || "/notifications");
  };

  const openSearchResult = (result) => {
    setSearch("");
    router.push(result.href);
  };

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200/70 bg-slate-50/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex max-w-full flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="hidden min-w-0 flex-1 lg:block" />

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen((value) => !value)}
                className="relative cursor-pointer rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </button>

              {notificationOpen ? (
                <div className="fixed left-4 right-4 top-20 z-20 mt-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:w-[22rem]">
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</p>
                    <button onClick={() => markAllRead()} className="cursor-pointer text-xs font-medium text-violet-600">
                      Mark all as read
                    </button>
                  </div>
                  <div className="no-scrollbar max-h-[70vh] space-y-1 overflow-y-auto sm:max-h-80">
                    {loading ? (
                      <div className="space-y-2 px-3 py-2">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <div key={index} className="animate-pulse rounded-xl bg-slate-100 p-4" />
                        ))}
                      </div>
                    ) : latestNotifications.length > 0 ? (
                      latestNotifications.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => openNotification(item)}
                          className={`block w-full cursor-pointer rounded-xl px-3 py-3 text-left hover:bg-slate-50 ${
                            item.read !== true ? "bg-violet-50/70 dark:bg-violet-950/40" : "dark:hover:bg-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                            {item.read !== true ? <span className="h-2 w-2 rounded-full bg-violet-600" /> : null}
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">{item.message}</p>
                          <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">No notifications yet.</div>
                    )}
                  </div>
                  <div className="border-t border-slate-100 px-3 py-2 dark:border-slate-700">
                    <Link href="/notifications" onClick={() => setNotificationOpen(false)} className="block cursor-pointer text-sm font-medium text-violet-600">
                      View all notifications
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name || user.email} className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                    {initials(user?.name || user?.email)}
                  </span>
                )}
                <span className="hidden max-w-28 truncate md:inline">{user?.name || user?.email || "Profile"}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {profileOpen ? (
                <div className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name || "User"}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email || ""}</p>
                  </div>
                  <Link href="/profile" onClick={() => setProfileOpen(false)} className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                    Profile
                  </Link>
                  <Link href="/settings" onClick={() => setProfileOpen(false)} className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                    Account Settings
                  </Link>
                  <button onClick={onLogout} className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative w-full lg:max-w-md" ref={searchRef}>
          <img src="/logo.png" alt="TeamHub" className="pointer-events-none absolute left-3 top-1/2 h-7 w-7 -translate-y-1/2 object-contain" />
          <Search className="pointer-events-none absolute left-12 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) {
                e.preventDefault();
                openSearchResult(results[0]);
              }
            }}
            placeholder="Search anything..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-[4.5rem] pr-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-400"
          />
          {deferredSearch.trim() ? (
            <div className="fixed left-4 right-4 top-28 z-20 mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900 lg:absolute lg:left-0 lg:right-0 lg:top-auto">
              {results.length > 0 ? (
                results.map((result) => (
                  <button
                    key={result.key}
                    onClick={() => openSearchResult(result)}
                    className="block w-full cursor-pointer rounded-xl px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <p className="text-xs font-semibold uppercase text-violet-600">{result.type}</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{result.title}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{result.description}</p>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">No results found</div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
