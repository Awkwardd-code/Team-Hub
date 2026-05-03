"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";

export default function VerifyForm({ email: initialEmail = "" }) {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      setUser(data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Verify email</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Verifying your code...</p>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Verify email</h1>
      <div>
        <label className="mb-1 block text-sm text-slate-700 dark:text-slate-200">Email</label>
        <input type="email" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-700 dark:text-slate-200">Verification code</label>
        <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={6} />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button disabled={loading} className="w-full rounded-lg bg-sky-600 px-4 py-2 text-white">
        {loading ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
}
