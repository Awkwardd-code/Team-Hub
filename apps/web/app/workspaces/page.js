"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "../../components/dashboard/DashboardShell";
import WorkspaceList from "../../components/workspaces/WorkspaceList";
import CreateWorkspaceModal from "../../components/workspaces/CreateWorkspaceModal";
import WorkspaceDetailsPanel from "../../components/workspaces/WorkspaceDetailsPanel";
import InviteMemberModal from "../../components/workspaces/InviteMemberModal";
import EmptyWorkspaceState from "../../components/workspaces/EmptyWorkspaceState";
import WorkspaceSkeleton from "../../components/workspaces/WorkspaceSkeleton";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useWorkspaceSocket } from "../../hooks/useWorkspaceSocket";
import { usePresenceStore } from "../../store/presenceStore";
import { useConfirm } from "../../components/common/ConfirmModal";

export default function WorkspacesPage() {
  const router = useRouter();
  const {
    workspaces,
    selectedWorkspace,
    loading,
    error,
    fetchWorkspaces,
    createWorkspace,
    fetchWorkspace,
    deleteWorkspace,
    inviteMember,
    updateMemberRole,
    removeMember,
    updateWorkspace,
    addWorkspaceFromSocket,
    updateWorkspaceFromSocket,
    deleteWorkspaceFromSocket,
  } = useWorkspaceStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [openingWorkspaceId, setOpeningWorkspaceId] = useState("");
  const setOnlineUsers = usePresenceStore((s) => s.setOnlineUsers);
  const confirm = useConfirm();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  async function handleOpenWorkspace(id) {
    try {
      setOpeningWorkspaceId(id);
      router.push(`/workspaces/${id}`);
    } finally {
      setOpeningWorkspaceId("");
    }
  }

  async function handleManageWorkspace(id) {
    await fetchWorkspace(id);
    setDetailsOpen(true);
  }

  async function handleCreateWorkspace(payload) {
    await createWorkspace(payload);
  }

  async function handleUpdateWorkspace(payload) {
    if (!selectedWorkspace?.id) return;
    await updateWorkspace(selectedWorkspace.id, payload);
  }

  async function handleDeleteWorkspace(id) {
    const confirmed = await confirm({
      title: "Delete workspace?",
      description: "This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;

    await deleteWorkspace(id);
  }

  async function handleInviteMember(payload) {
    if (!selectedWorkspace?.id) return;
    setSuccess("");
    await inviteMember(selectedWorkspace.id, payload);
    setSuccess("Invitation sent. The user will be added after accepting.");
  }

  async function handleRoleChange(memberId, role) {
    if (!selectedWorkspace?.id) return;
    await updateMemberRole(selectedWorkspace.id, memberId, role);
  }

  async function handleRemoveMember(memberId) {
    if (!selectedWorkspace?.id) return;

    const confirmed = await confirm({
      title: "Remove member?",
      description: "This user will lose access to this workspace.",
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmed) return;

    await removeMember(selectedWorkspace.id, memberId);
  }

  const activeWorkspaceId = selectedWorkspace?.id || workspaces[0]?.id || "";
  useWorkspaceSocket(activeWorkspaceId, {
    "workspace:created": addWorkspaceFromSocket,
    "workspace:updated": updateWorkspaceFromSocket,
    "workspace:deleted": ({ id }) => deleteWorkspaceFromSocket(id),
    "presence:updated": ({ workspaceId, users, count }) => setOnlineUsers(workspaceId, users || [], count),
  });

  return (
    <DashboardShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Workspaces</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Manage your teams, projects, and collaboration spaces.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="cursor-pointer rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            + Create Workspace
          </button>
        </header>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
            {success}
          </div>
        )}

        {loading ? (
          <WorkspaceSkeleton />
        ) : workspaces.length === 0 ? (
          <EmptyWorkspaceState onCreate={() => setCreateOpen(true)} />
        ) : (
          <WorkspaceList
            workspaces={workspaces}
            onOpen={handleOpenWorkspace}
            onManage={handleManageWorkspace}
            onDelete={handleDeleteWorkspace}
            openingWorkspaceId={openingWorkspaceId}
          />
        )}
      </div>

      <CreateWorkspaceModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateWorkspace}
      />

      <WorkspaceDetailsPanel
        workspace={detailsOpen ? selectedWorkspace : null}
        onClose={() => setDetailsOpen(false)}
        onInvite={() => setInviteOpen(true)}
        onEdit={() => setEditOpen(true)}
        onRoleChange={handleRoleChange}
        onRemove={handleRemoveMember}
      />

      <InviteMemberModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInviteMember}
      />

      {editOpen && selectedWorkspace ? (
        <CreateWorkspaceModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onCreate={handleUpdateWorkspace}
          initialValues={selectedWorkspace}
          submitLabel="Update Workspace"
          title="Edit Workspace"
        />
      ) : null}
    </DashboardShell>
  );
}
