"use client";

import { useEffect, useState } from "react";
import AdminRoute from "../../../components/auth/AdminRoute";
import DashboardShell from "../../../components/dashboard/DashboardShell";
import SettingsSkeleton from "../../../components/admin/workspace-settings/SettingsSkeleton";
import WorkspaceSettingsForm from "../../../components/admin/workspace-settings/WorkspaceSettingsForm";
import { useWorkspaceStore } from "../../../store/workspaceStore";
import { useWorkspaceSettingStore } from "../../../store/workspaceSettingStore";

export default function AdminWorkspaceSettingsPage() {
  const { workspaces, fetchWorkspaces } = useWorkspaceStore();
  const { settings, loading, error, fetchSettings, updateSettings } =
    useWorkspaceSettingStore();

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");

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
      fetchSettings(selectedWorkspaceId);
    }
  }, [selectedWorkspaceId, fetchSettings]);

  async function handleSave(payload) {
    await updateSettings(selectedWorkspaceId, payload);
  }

  return (
    <DashboardShell>
      <AdminRoute>
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Workspace Settings
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Configure workspace-level policies and defaults.
              </p>
            </div>

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
          </header>

          {!selectedWorkspaceId && (
            <section className="rounded-3xl border border-dashed border-violet-200 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                No workspace found
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Create a workspace first before configuring workspace settings.
              </p>
            </section>
          )}

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          {selectedWorkspaceId &&
            (loading || !settings ? (
              <SettingsSkeleton />
            ) : (
              <WorkspaceSettingsForm settings={settings} onSave={handleSave} />
            ))}
        </div>
      </AdminRoute>
    </DashboardShell>
  );
}
