"use client";

import { useEffect, useState } from "react";
import DashboardShell from "../../components/dashboard/DashboardShell";
import { useThemeStore } from "../../store/themeStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
}

export default function SettingsPage() {
  const setTheme = useThemeStore((state) => state.setTheme);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    theme: "light",
    notifyMentions: true,
    notifyTasks: true,
    notifyRoleChanges: true,
  });

  useEffect(() => {
    let mounted = true;

    request("/api/settings/preferences")
      .then((data) => {
        if (!mounted) return;
        const currentTheme = useThemeStore.getState().theme;
        setForm({
          theme: currentTheme === "dark" ? "dark" : "light",
          notifyMentions: data.notifyMentions !== false,
          notifyTasks: data.notifyTasks !== false,
          notifyRoleChanges: data.notifyRoleChanges !== false,
        });
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load settings");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const save = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const data = await request("/api/settings/preferences", {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      setForm({
        theme: form.theme === "dark" ? "dark" : "light",
        notifyMentions: data.notifyMentions !== false,
        notifyTasks: data.notifyTasks !== false,
        notifyRoleChanges: data.notifyRoleChanges !== false,
      });
      setTheme(form.theme);
      setMessage("Preferences saved.");
    } catch (err) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Manage account preferences, notifications, and security options.</p>
        </header>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900" />
            ))}
          </div>
        ) : (
          <>
            <section className="grid gap-6 md:grid-cols-2">
              <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Account preferences</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose how TeamHub should look and feel on this account.</p>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Theme preference</label>
                    <select
                      value={form.theme}
                      onChange={(e) => {
                        setForm((current) => ({ ...current, theme: e.target.value }));
                        setTheme(e.target.value);
                      }}
                      className="mt-2 w-full cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notification preferences</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Decide which real-time alerts matter enough to interrupt you.</p>

                <div className="mt-5 space-y-4">
                  {[
                    ["notifyMentions", "Mentions"],
                    ["notifyTasks", "Task assignments"],
                    ["notifyRoleChanges", "Role changes"],
                  ].map(([key, label]) => (
                    <label key={key} className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
                      <input
                        type="checkbox"
                        checked={form[key]}
                        onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.checked }))}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                      />
                    </label>
                  ))}
                </div>
              </article>
            </section>

            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Security</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Password and session controls are kept separate from workspace settings.</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/forgot-password"
                  className="inline-flex cursor-pointer rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Change password
                </a>
                <button
                  type="button"
                  className="cursor-not-allowed rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-400 dark:border-slate-700"
                  disabled
                >
                  Logout all sessions
                </button>
              </div>
            </section>

            {error ? <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">{error}</div> : null}
            {message ? <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{message}</div> : null}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="cursor-pointer rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save preferences"}
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
