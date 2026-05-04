"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../services/authApi";
import { useAuthStore } from "../../../store/authStore";
import GoogleAuthButton from "./GoogleAuthButton";

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-sm text-slate-400 dark:text-slate-500">
      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      <span>or</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGoogleSuggestion, setShowGoogleSuggestion] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowGoogleSuggestion(false);

    try {
      const data = await authApi.login(form);
      setUser(data.user);
      router.push("/dashboard");
    } catch (err) {
      const message = err?.message || "Login failed";
      setError(message);
      const lowerMessage = String(message).toLowerCase();
      if (
        lowerMessage.includes("invalid email or password") ||
        lowerMessage.includes("email not verified") ||
        lowerMessage.includes("unauthorized")
      ) {
        setShowGoogleSuggestion(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Login</h1>
        <p className="text-base text-slate-500 dark:text-slate-400">Checking your credentials...</p>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Login</h1>
      <p className="text-base text-slate-500 dark:text-slate-400">Enter your credentials to access your account</p>

      <div className="pt-3">
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email address</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div className="pt-1">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
          <Link className="text-sm font-medium text-sky-600 hover:underline" href="/forgot-password">
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>

      {error ? (
        <div className="space-y-2">
          <p className="text-sm text-red-600">{error}</p>
          {showGoogleSuggestion ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              If you registered with Google, use <span className="font-medium">Continue with Google</span> below.
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        disabled={loading}
        className="mt-2 w-full rounded-xl bg-linear-to-r from-sky-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:opacity-95"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <Divider />

      <div className="space-y-3">
        <GoogleAuthButton label="Continue with Google" />
      </div>

      <p className="pt-3 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link className="font-medium text-sky-600 hover:underline" href="/register">
          Sign up
        </Link>
      </p>
    </form>
  );
}
