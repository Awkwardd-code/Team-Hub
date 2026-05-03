"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../../components/dashboard/DashboardShell";
import CreateAnnouncementModal from "../../components/announcements/CreateAnnouncementModal";
import AnnouncementCard from "../../components/announcements/AnnouncementCard";
import AnnouncementSkeleton from "../../components/announcements/AnnouncementSkeleton";
import EmptyAnnouncementsState from "../../components/announcements/EmptyAnnouncementsState";
import EditAnnouncementModal from "../../components/announcements/EditAnnouncementModal";
import { useAnnouncementStore } from "../../store/announcementStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { workspaceApi } from "../../features/workspaces/services/workspaceApi";
import { useWorkspaceSocket } from "../../hooks/useWorkspaceSocket";
import { usePresenceStore } from "../../store/presenceStore";
import { useConfirm } from "../../components/common/ConfirmModal";
export default function AnnouncementsPage() {
  const {
    announcements,
    loading,
    error,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    createComment,
    toggleReaction,
  } = useAnnouncementStore();
const {
  addAnnouncementFromSocket,
  updateAnnouncementFromSocket,
  deleteAnnouncementFromSocket,
  addAnnouncementCommentFromSocket,
  updateAnnouncementReactionFromSocket,
} = useAnnouncementStore();
  const setOnlineUsers = usePresenceStore((s) => s.setOnlineUsers);
  const { workspaces, selectedWorkspace, fetchWorkspaces } = useWorkspaceStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [workspaceFilter, setWorkspaceFilter] = useState("");
  const [editAnnouncement, setEditAnnouncement] = useState(null);
  const [membersByWorkspace, setMembersByWorkspace] = useState({});
  const [mentionWorkspaceId, setMentionWorkspaceId] = useState("");
  const confirm = useConfirm();

  useEffect(() => {
    fetchWorkspaces();
    fetchAnnouncements();
  }, [fetchWorkspaces, fetchAnnouncements]);

  useEffect(() => {
    const workspaceIds = Array.from(new Set(announcements.map((item) => item.workspaceId).filter(Boolean)));
    workspaceIds.forEach((workspaceId) => {
      ensureMembers(workspaceId);
    });
  }, [announcements]);

  async function ensureMembers(workspaceId) {
    if (!workspaceId || membersByWorkspace[workspaceId]) return;
    try {
      const workspace = await workspaceApi.getWorkspace(workspaceId);
      setMembersByWorkspace((prev) => ({
        ...prev,
        [workspaceId]: (workspace.members || []).map((member) => member.user),
      }));
    } catch {
      setMembersByWorkspace((prev) => ({ ...prev, [workspaceId]: [] }));
    }
  }

  const filteredAnnouncements = useMemo(() => {
    if (!workspaceFilter) return announcements;
    return announcements.filter((item) => item.workspaceId === workspaceFilter);
  }, [announcements, workspaceFilter]);

  async function handleCreate(payload) {
    await createAnnouncement(payload);
  }

  async function handleDelete(id) {
    const confirmed = await confirm({
      title: "Delete announcement?",
      description: "This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;

    await deleteAnnouncement(id);
  }

  async function handleAddComment(id, content) {
    await createComment(id, { content });
  }
const activeWorkspaceId = selectedWorkspace?.id || workspaceFilter || workspaces[0]?.id || "";
useWorkspaceSocket(activeWorkspaceId, {
  "announcement:created": addAnnouncementFromSocket,
  "announcement:updated": updateAnnouncementFromSocket,
  "announcement:deleted": ({ id }) => deleteAnnouncementFromSocket(id),
  "announcement:comment-created": addAnnouncementCommentFromSocket,
  "announcement:reaction-updated": updateAnnouncementReactionFromSocket,
  "presence:updated": ({ workspaceId, users, count }) => setOnlineUsers(workspaceId, users || [], count),
});
  async function handleToggleReaction(id, emoji) {
    await toggleReaction(id, emoji);
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Announcements</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Share workspace updates and keep everyone aligned.
            </p>
          </div>

          <button
            onClick={async () => {
              const targetWorkspaceId = workspaceFilter || selectedWorkspace?.id || workspaces[0]?.id;
              if (targetWorkspaceId) await ensureMembers(targetWorkspaceId);
              setMentionWorkspaceId(targetWorkspaceId || "");
              setCreateOpen(true);
            }}
            className="cursor-pointer rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            + New Announcement
          </button>
        </header>

        <section className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Filter by workspace</label>
          <select
            value={workspaceFilter}
            onChange={(e) => setWorkspaceFilter(e.target.value)}
            className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 md:max-w-md"
          >
            <option value="">All workspaces</option>
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <AnnouncementSkeleton />
        ) : filteredAnnouncements.length === 0 ? (
          <EmptyAnnouncementsState onCreate={() => setCreateOpen(true)} />
        ) : (
          <div className="space-y-5">
            {filteredAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onDelete={handleDelete}
                onEdit={setEditAnnouncement}
                onToggleReaction={handleToggleReaction}
                onAddComment={handleAddComment}
                members={membersByWorkspace[announcement.workspaceId] || []}
              />
            ))}
          </div>
        )}
      </div>

      <CreateAnnouncementModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        workspaces={workspaces}
        members={membersByWorkspace[mentionWorkspaceId] || []}
        onWorkspaceChange={(workspaceId) => {
          setMentionWorkspaceId(workspaceId);
          ensureMembers(workspaceId);
        }}
      />
      <EditAnnouncementModal
        open={Boolean(editAnnouncement)}
        announcement={editAnnouncement}
        onClose={() => setEditAnnouncement(null)}
        onSubmit={updateAnnouncement}
        members={membersByWorkspace[editAnnouncement?.workspaceId] || []}
      />
    </DashboardShell>
  );
}
