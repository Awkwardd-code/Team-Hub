"use client";

import { useMemo, useState } from "react";
import { updateCurrentUserProfile } from "../../features/profile/services/profileApi";
import { useAuthStore } from "../../store/authStore";
import AvatarUpload from "./AvatarUpload";

export default function ProfileForm({ user }) {
  const { setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarError, setAvatarError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialName = user?.name || "";
  const initialAvatarUrl = user?.avatarUrl || "";

  const isDirty = useMemo(() => {
    return name.trim() !== initialName || Boolean(selectedFile);
  }, [name, initialName, selectedFile]);

  const disableSave = loading || !isDirty || !name.trim() || Boolean(avatarError);

  const onCancel = () => {
    setName(initialName);
    setSelectedFile(null);
    setAvatarError("");
    setError("");
    setSuccess("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (avatarError) {
      setError("Please fix the avatar issue before saving.");
      return;
    }

    if (!isDirty) {
      return;
    }

    setLoading(true);
    try {
      const data = await updateCurrentUserProfile({ name: name.trim(), avatarFile: selectedFile });
      setUser(data.user);
      setName(data.user.name || "");
      setSelectedFile(null);
      setSuccess("Profile updated successfully.");
    } catch (submitError) {
      setError(submitError.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 md:p-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-8">
        <section className="space-y-4 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Profile photo</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose a clear image that represents you.</p>
          </div>

          <AvatarUpload
            name={name || user?.name}
            avatarUrl={initialAvatarUrl}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            onFileRemove={() => setSelectedFile(null)}
            onErrorChange={setAvatarError}
            disabled={loading}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Personal information</h2>

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Full name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Your full name"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email address
            </label>
            <input
              id="email"
              value={user?.email || ""}
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-500"
              disabled
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Email address cannot be changed.</p>
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-end dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          disabled={disableSave}
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {success ? <p className="mt-4 text-sm text-emerald-600">{success}</p> : null}
    </form>
  );
}
