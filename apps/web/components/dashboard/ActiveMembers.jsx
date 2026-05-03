import DashboardCard from "./DashboardCard";
import { usePresenceStore } from "../../store/presenceStore";

const EMPTY_PRESENCE = { users: [], count: 0 };

function initials(value) {
  return (value || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ActiveMembers() {
  const activeWorkspaceId = usePresenceStore((state) => state.activeWorkspaceId);
  const onlineUsersByWorkspace = usePresenceStore((state) => state.onlineUsersByWorkspace);
  const presence = activeWorkspaceId ? onlineUsersByWorkspace[activeWorkspaceId] || EMPTY_PRESENCE : EMPTY_PRESENCE;
  const members = (presence.users || []).slice(0, 5);

  return (
    <DashboardCard title="Members Online" action={<button className="text-xs font-medium text-violet-600 hover:underline">View all</button>}>
      <div className="flex items-center gap-2">
        {members.map((member) => (
          <div key={member.id} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
            {initials(member.name || member.email)}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </div>
        ))}
        {(presence.count || members.length) > members.length ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
            +{(presence.count || members.length) - members.length}
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">{presence.count || members.length} members online</span>
      </p>
    </DashboardCard>
  );
}
