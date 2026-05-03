"use client";

import { useEffect, useState } from "react";
import AdminRoute from "../../../components/auth/AdminRoute";
import DashboardShell from "../../../components/dashboard/DashboardShell";
import AdminMembersSkeleton from "../../../components/admin/members/AdminMembersSkeleton";
import AdminMembersTable from "../../../components/admin/members/AdminMembersTable";
import InviteAdminMemberModal from "../../../components/admin/members/InviteAdminMemberModal";
import { useWorkspaceStore } from "../../../store/workspaceStore";
import { useAdminMemberStore } from "../../../store/adminMemberStore";
import { useConfirm } from "../../../components/common/ConfirmModal";

export default function AdminMembersPage() {
  const { workspaces, fetchWorkspaces } = useWorkspaceStore();

  const {
    members,
    loading,
    error,
    fetchMembers,
    inviteMember,
    updateMemberRole,
    removeMember,
  } = useAdminMemberStore();

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const confirm = useConfirm();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (!selectedWorkspaceId && workspaces.length > 0) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, selectedWorkspaceId]);

  useEffect(() => {
    if (selectedWorkspaceId) {
      fetchMembers(selectedWorkspaceId);
    }
  }, [selectedWorkspaceId, fetchMembers]);

  async function handleInvite(payload) {
    setSuccess("");
    await inviteMember(selectedWorkspaceId, payload);
    setSuccess("Invitation sent. The user will be added after accepting.");
  }

  async function handleRoleChange(memberId, role) {
    setSuccess("");
    await updateMemberRole(selectedWorkspaceId, memberId, role);
    setSuccess("Member role updated.");
  }

  async function handleRemove(memberId) {
    const confirmed = await confirm({
      title: "Remove member?",
      description: "This user will lose access to the workspace.",
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmed) return;

    setSuccess("");
    await removeMember(selectedWorkspaceId, memberId);
    setSuccess("Member removed.");
  }

  return (
    <DashboardShell>
      <AdminRoute>
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Members & Roles</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Manage user access levels and role assignments.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-violet-500"
              >
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setInviteOpen(true)}
                disabled={!selectedWorkspaceId}
                className="cursor-pointer rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                + Invite Member
              </button>
            </div>
          </header>

          {!selectedWorkspaceId && (
            <section className="rounded-3xl border border-dashed border-violet-200 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                No workspace found
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Create a workspace before managing members.
              </p>
            </section>
          )}

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {success}
            </div>
          )}

          {selectedWorkspaceId &&
            (loading ? (
              <AdminMembersSkeleton />
            ) : members.length === 0 ? (
              <section className="rounded-3xl border border-dashed border-violet-200 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  No members yet
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Invite existing users to collaborate in this workspace.
                </p>
              </section>
            ) : (
              <AdminMembersTable
                members={members}
                onRoleChange={handleRoleChange}
                onRemove={handleRemove}
              />
            ))}
        </div>

        <InviteAdminMemberModal
          open={inviteOpen}
          onClose={() => setInviteOpen(false)}
          onInvite={handleInvite}
        />
      </AdminRoute>
    </DashboardShell>
  );
}
