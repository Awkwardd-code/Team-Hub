"use client";

import { AtSign, Bell, CheckSquare, Megaphone, Target } from "lucide-react";

const iconByType = {
  mention: AtSign,
  goal_mention: Target,
  goal_update: Target,
  announcement_comment: Megaphone,
  announcement_reaction: Megaphone,
  task: CheckSquare,
  announcement: Megaphone,
  goal: Target,
  role: Bell,
  role_update: Bell,
  workspace_invite: Bell,
  workspace_invite_accepted: Bell,
  workspace_invite_declined: Bell,
};

const colorByType = {
  mention: "bg-violet-100 text-violet-700",
  goal_mention: "bg-emerald-100 text-emerald-700",
  goal_update: "bg-emerald-100 text-emerald-700",
  announcement_comment: "bg-amber-100 text-amber-700",
  announcement_reaction: "bg-amber-100 text-amber-700",
  task: "bg-sky-100 text-sky-700",
  announcement: "bg-amber-100 text-amber-700",
  goal: "bg-emerald-100 text-emerald-700",
  role: "bg-indigo-100 text-indigo-700",
  role_update: "bg-indigo-100 text-indigo-700",
  workspace_invite: "bg-indigo-100 text-indigo-700",
  workspace_invite_accepted: "bg-emerald-100 text-emerald-700",
  workspace_invite_declined: "bg-orange-100 text-orange-700",
};

export default function NotificationItem({
  item,
  onMarkRead,
  onOpen,
  onAcceptInvitation,
  onDeclineInvitation,
}) {
  const Icon = iconByType[item.type] || Bell;
  const invitationId = item?.metadata?.invitationId;
  const inviteStatus = item?.metadata?.status;
  const isInvitePending = item.type === "workspace_invite" && invitationId && !inviteStatus;

  return (
    <div
      onClick={() => onOpen(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(item);
        }
      }}
      className={`w-full cursor-pointer rounded-2xl border p-4 text-left transition hover:border-violet-200 hover:bg-violet-50/40 ${
        item.read !== true ? "border-violet-200 bg-violet-50/50" : "border-slate-100 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl ${
            colorByType[item.type] || "bg-slate-100 text-slate-700"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            {item.read !== true ? <span className="h-2.5 w-2.5 rounded-full bg-violet-600" /> : null}
          </div>
          <p className="mt-1 text-sm text-slate-600">{item.message}</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
            {item.read !== true ? (
              <span
                onClick={(event) => {
                  event.stopPropagation();
                  onMarkRead(item.id);
                }}
                className="cursor-pointer text-xs font-medium text-violet-600 hover:text-violet-700"
              >
                Mark read
              </span>
            ) : null}
          </div>
          {isInvitePending ? (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  if (process.env.NODE_ENV !== "production") {
                    console.log("Accept invitation notification:", item);
                  }
                  onAcceptInvitation?.(invitationId, item.id, item);
                }}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeclineInvitation?.(invitationId, item.id, item);
                }}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Decline
              </button>
            </div>
          ) : null}
          {inviteStatus === "ACCEPTED" ? (
            <div className="mt-3 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              Accepted
            </div>
          ) : null}
          {inviteStatus === "DECLINED" ? (
            <div className="mt-3 inline-flex rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
              Declined
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
