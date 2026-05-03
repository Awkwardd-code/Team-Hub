"use client";

import { useEffect, useMemo } from "react";
import { useWorkspaceSocket } from "../../hooks/useWorkspaceSocket";
import { useAuthStore } from "../../store/authStore";
import { usePresenceStore } from "../../store/presenceStore";
import { useWorkspaceStore } from "../../store/workspaceStore";

const EMPTY_PRESENCE = { users: [], count: 0 };

function initials(name) {
  return (
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

export default function OnlineMembers() {
  const user = useAuthStore((state) => state.user);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const selectedWorkspace = useWorkspaceStore((state) => state.selectedWorkspace);
  const fetchWorkspaces = useWorkspaceStore((state) => state.fetchWorkspaces);

  const workspaceId = useMemo(
    () => selectedWorkspace?.id || workspaces[0]?.id || "",
    [selectedWorkspace?.id, workspaces]
  );
  const onlineUsersByWorkspace = usePresenceStore((state) => state.onlineUsersByWorkspace);
  const presence = workspaceId ? onlineUsersByWorkspace[workspaceId] || EMPTY_PRESENCE : EMPTY_PRESENCE;
  const setOnlineUsers = usePresenceStore((state) => state.setOnlineUsers);

  useEffect(() => {
    if (workspaces.length === 0) {
      fetchWorkspaces();
    }
  }, [fetchWorkspaces, workspaces.length]);

  useWorkspaceSocket(workspaceId, {
    "presence:updated": (payload) => {
      if (payload?.workspaceId === workspaceId) {
        setOnlineUsers(workspaceId, payload.users || [], payload.count);
      }
    },
  });

  const visibleUsers = (presence.users || []).filter(Boolean);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Online Members</h2>
          <p className="text-sm text-slate-500">{presence.count || visibleUsers.length} currently online</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {visibleUsers.length === 0 ? (
          <p className="text-sm text-slate-500">No members online.</p>
        ) : (
          visibleUsers.map((member) => (
            <div key={member.id} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
              <div className="relative">
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.name} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                    {initials(member.name)}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700">{member.name || member.email}</p>
                {user?.id === member.id ? <p className="text-xs text-slate-500">You</p> : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

