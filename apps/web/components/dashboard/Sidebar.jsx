"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  Briefcase,
  ClipboardList,
  Flag,
  LayoutDashboard,
  Megaphone,
  Settings,
  Shield,
  Target,
  UserCircle2,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useWorkspaceStore } from "../../store/workspaceStore";

const primaryLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
  { href: "/workspaces", label: "Workspaces", icon: Briefcase },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/milestones", label: "Milestones", icon: Flag },
  { href: "/action-items", label: "Action Items", icon: ClipboardList },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

const adminLinks = [
  { href: "/admin", label: "Admin Home" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/workspace-settings", label: "Workspace Settings" },
  { href: "/admin/audit-log", label: "Audit Log" },
];

function getInitials(name) {
  return (name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function SidebarContent({ pathname, router, user, currentWorkspace, onNavigate, mobile }) {
  return (
    <div className="no-scrollbar h-full overflow-y-auto px-4 py-5">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{mobile ? "Navigation" : ""}</span>
        {mobile ? (
          <button
            onClick={onNavigate}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <button
        onClick={() => {
          router.push("/dashboard");
          onNavigate?.();
        }}
        className="flex cursor-pointer items-center gap-2 rounded-2xl px-2 py-2 text-left"
      >
        <img src="/logo.png" alt="TeamHub" className="h-8 w-8 object-contain" />
        <div className="min-w-0">
          <p className="text-lg font-bold text-slate-900 dark:text-white">TeamHub</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Workspace operations</p>
        </div>
      </button>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Active Workspace</p>
        <p className="mt-2 truncate text-sm font-semibold text-slate-900 dark:text-white">
          {currentWorkspace?.name || "No workspace selected"}
        </p>
        <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
          {currentWorkspace?.description || "Open a workspace to see goals, tasks, and member activity."}
        </p>
        {currentWorkspace?.id ? (
          <Link
            href={`/workspaces/${currentWorkspace.id}`}
            onClick={onNavigate}
            className="mt-3 inline-flex cursor-pointer rounded-xl bg-white px-3 py-2 text-xs font-semibold text-violet-600 shadow-sm dark:bg-slate-800 dark:text-violet-300"
          >
            Open workspace
          </Link>
        ) : null}
      </div>

      <nav className="mt-6 space-y-1">
        {primaryLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {user?.isAdmin ? (
        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/70 dark:bg-amber-950/30">
          <div className="mb-3 flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <Shield className="h-4 w-4" />
            <p className="text-sm font-semibold">Admin</p>
          </div>
          <div className="space-y-1">
            {adminLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className={`block cursor-pointer rounded-xl px-3 py-2 text-sm ${
                    active ? "bg-white font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-200" : "text-amber-700 hover:bg-white/70 dark:text-amber-300 dark:hover:bg-amber-900/20"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name || user.email || "User"} className="h-11 w-11 rounded-full object-cover" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
              {getInitials(user?.name || user?.email)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name || "TeamHub User"}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email || "No email loaded"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ mobile = false, open = false, onClose = () => {} }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const selectedWorkspace = useWorkspaceStore((state) => state.selectedWorkspace);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const currentWorkspace = selectedWorkspace || workspaces[0] || null;

  useEffect(() => {
    if (!mobile || !open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobile, open, onClose]);

  if (!mobile) {
    return (
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex lg:flex-col">
        <SidebarContent pathname={pathname} router={router} user={user} currentWorkspace={currentWorkspace} />
      </aside>
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        aria-label="Close menu"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />
      <aside className="no-scrollbar absolute left-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto bg-white shadow-2xl dark:bg-slate-900">
        <SidebarContent
          pathname={pathname}
          router={router}
          user={user}
          currentWorkspace={currentWorkspace}
          onNavigate={onClose}
          mobile
        />
      </aside>
    </div>
  );
}
