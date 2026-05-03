"use client";

import { MessageCircle, Pin, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import MentionTextarea from "../common/MentionTextarea";

function groupReactions(reactions = []) {
  return reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {});
}

function hasReacted(reactions = [], userId, emoji) {
  return reactions.some((reaction) => reaction.userId === userId && reaction.emoji === emoji);
}

function initials(nameOrEmail) {
  return (nameOrEmail || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AnnouncementCard({
  announcement,
  onDelete,
  onEdit,
  onToggleReaction,
  onAddComment,
  members = [],
}) {
  const user = useAuthStore((state) => state.user);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const groupedReactions = groupReactions(announcement.reactions || []);

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!commentText?.trim() || sendingComment) return;

    try {
      setSendingComment(true);
      await onAddComment(announcement.id, commentText);
      setCommentText("");
    } finally {
      setSendingComment(false);
    }
  }

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {announcement.pinned && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                <Pin size={13} />
                Pinned
              </span>
            )}

            <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(announcement.createdAt).toLocaleString()}</span>
          </div>

          <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{announcement.title}</h2>

          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">{announcement.content}</p>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit(announcement)}
            className="cursor-pointer rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(announcement.id)}
            className="cursor-pointer rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        {["👍", "🎉", "❤️"].map((emoji) => {
          const isActive = hasReacted(announcement.reactions || [], user?.id, emoji);

          return (
            <button
              key={emoji}
              onClick={() => onToggleReaction(announcement.id, emoji)}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${
                isActive
                  ? "border-violet-300 bg-violet-50 text-violet-700"
                  : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {emoji} {groupedReactions[emoji] || 0}
            </button>
          );
        })}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <MessageCircle size={16} />
          Comments
        </div>

        <div className="space-y-3">
          {announcement.comments?.length > 0 ? (
            announcement.comments.map((comment) => (
              <div key={comment.id} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                <div className="flex items-start gap-3">
                  {comment.user?.avatarUrl ? (
                    <img src={comment.user.avatarUrl} alt={comment.user?.name || comment.user?.email} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                      {initials(comment.user?.name || comment.user?.email)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{comment.user?.name}</p>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600 dark:text-slate-300">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
              No comments yet. Start the conversation.
            </div>
          )}
        </div>

        <form onSubmit={handleCommentSubmit} className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-start gap-3">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user?.name || user?.email} className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                {initials(user?.name || user?.email)}
              </div>
            )}
            <div className="flex-1 space-y-3">
              <MentionTextarea
                value={commentText}
                onChange={setCommentText}
                members={members}
                placeholder="Write a comment... Use @ to mention teammates"
                rows={3}
                onKeyDown={(e) => {
                  if (!e.defaultPrevented && (e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleCommentSubmit(e);
                  }
                }}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">Use Ctrl/Cmd + Enter to send</p>
                <button
                  disabled={!commentText.trim() || sendingComment}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sendingComment ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </article>
  );
}
