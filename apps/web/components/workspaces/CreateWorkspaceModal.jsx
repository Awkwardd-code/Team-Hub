"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const colors = ["#7c3aed", "#2563eb", "#059669", "#ea580c", "#dc2626", "#0891b2"];

export default function CreateWorkspaceModal({
  open,
  onClose,
  onCreate,
  initialValues = null,
  submitLabel = "Create Workspace",
  title = "Create Workspace",
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    accentColor: "#7c3aed",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && initialValues) {
      setForm({
        name: initialValues.name || "",
        description: initialValues.description || "",
        accentColor: initialValues.accentColor || "#7c3aed",
      });
    }
    if (open && !initialValues) {
      setForm({ name: "", description: "", accentColor: "#7c3aed" });
    }
  }, [open, initialValues]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Workspace name is required");
      return;
    }

    try {
      setLoading(true);
      await onCreate(form);
      setForm({ name: "", description: "", accentColor: "#7c3aed" });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const values = initialValues
    ? {
        name: initialValues.name || "",
        description: initialValues.description || "",
        accentColor: initialValues.accentColor || "#7c3aed",
      }
    : form;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4 sm:p-6 backdrop-blur-sm">
      <div className="mx-auto my-6 w-full max-w-lg max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Start a new team collaboration space.</p>
          </div>

          <button onClick={onClose} className="cursor-pointer rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Workspace name</label>
            <input
              value={values.name}
              onChange={(e) => setForm({ ...values, name: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Acme Workspace"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
            <textarea
              value={values.description}
              onChange={(e) => setForm({ ...values, description: e.target.value })}
              className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="What is this workspace for?"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Accent color</label>
            <div className="mt-3 flex gap-3">
              {colors.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setForm({ ...form, accentColor: color })}
                  style={{ backgroundColor: color }}
                  className={`h-9 w-9 cursor-pointer rounded-full border-4 ${
                    values.accentColor === color ? "border-slate-900 dark:border-white" : "border-white dark:border-slate-900"
                  } shadow`}
                />
              ))}
            </div>
          </div>

          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="cursor-pointer rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
