"use client";

import Link from "next/link";
import { CheckCircle, Circle, KeyRound } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../services/authApi";

function PasswordRule({ valid, text }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {valid ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <Circle className="h-4 w-4 text-slate-300" />}
      <span className={valid ? "text-emerald-700 dark:text-emerald-300" : "text-slate-500 dark:text-slate-400"}>{text}</span>
    </div>
  );
}

export default function ResetPasswordForm({ token }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const rules = {
    length: newPassword.length >= 8,
    number: /\d/.test(newPassword),
    uppercase: /[A-Z]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  const isStrongPassword = Object.values(rules).every(Boolean);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!isStrongPassword) {
        throw new Error("Please meet all password requirements.");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      await authApi.resetPassword({ token, newPassword });
      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1400);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Create new password</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Resetting password...</p>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600">
        <KeyRound className="h-6 w-6" />
      </div>

      <div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Create new password</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Enter your new password below.</p>
      </div>

      <div>
        <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">New password</label>
        <input
          id="new-password"
          type="password"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-3 dark:border-violet-900/50 dark:bg-violet-950/30">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Password requirements</p>
        <div className="space-y-1.5">
          <PasswordRule valid={rules.length} text="At least 8 characters" />
          <PasswordRule valid={rules.number} text="Includes a number" />
          <PasswordRule valid={rules.uppercase} text="Includes an uppercase letter" />
          <PasswordRule valid={rules.special} text="Includes a special character" />
        </div>
      </div>

      <div>
        <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Confirm new password</label>
        <input
          id="confirm-password"
          type="password"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {success ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{success}</p> : null}
      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">{error}</p> : null}

      <button
        disabled={loading}
        className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>

      <p className="pt-1 text-sm text-slate-500 dark:text-slate-400">
        <Link className="font-medium text-violet-600 hover:underline" href="/login">
          Back to login
        </Link>
      </p>
    </form>
  );
}
