"use client";

import { useEffect, useState } from "react";
import SettingToggle from "./SettingToggle";

export default function WorkspaceSettingsForm({ settings, onSave }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (settings) {
      setForm({
        allowMemberInvites: settings.allowMemberInvites,
        requireAdminApprovals: settings.requireAdminApprovals,
        allowPublicExports: settings.allowPublicExports,
        defaultGoalStatus: settings.defaultGoalStatus,
        defaultActionPriority: settings.defaultActionPriority,
      });
    }
  }, [settings]);

  if (!form) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setSaving(true);
      await onSave(form);
      setMessage("Workspace settings saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Workspace Policies</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure default rules for collaboration, exports, and workspace behavior.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <SettingToggle
          title="Allow member invites"
          description="Allow regular members to invite new teammates into the workspace."
          checked={form.allowMemberInvites}
          onChange={(value) => setForm({ ...form, allowMemberInvites: value })}
        />

        <SettingToggle
          title="Require admin approvals"
          description="Require admin approval before sensitive changes are applied."
          checked={form.requireAdminApprovals}
          onChange={(value) => setForm({ ...form, requireAdminApprovals: value })}
        />

        <SettingToggle
          title="Allow public exports"
          description="Allow workspace members to export data outside the workspace."
          checked={form.allowPublicExports}
          onChange={(value) => setForm({ ...form, allowPublicExports: value })}
        />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Default goal status
          </label>
          <select
            value={form.defaultGoalStatus}
            onChange={(e) =>
              setForm({ ...form, defaultGoalStatus: e.target.value })
            }
            className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Default action priority
          </label>
          <select
            value={form.defaultActionPriority}
            onChange={(e) =>
              setForm({ ...form, defaultActionPriority: e.target.value })
            }
            className="mt-2 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {message && (
        <p className="mt-6 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
