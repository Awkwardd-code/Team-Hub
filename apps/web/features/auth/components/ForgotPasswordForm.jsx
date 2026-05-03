"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useState } from "react";
import { authApi } from "../services/authApi";
import GoogleAuthButton from "./GoogleAuthButton";

function Divider() {
  return (
    <div className="my-4 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      <span>or</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = await authApi.forgotPassword({ email });
      setMessage(data.message || "If an account exists, a reset link has been sent.");
    } catch (requestError) {
      setError(requestError.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Enter your email</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Sending reset link...</p>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600">
        <Mail className="h-6 w-6" />
      </div>

      <div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Enter your email</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">We&apos;ll send you a password reset link.</p>
      </div>

      <div>
        <label htmlFor="forgot-email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Email address
        </label>
        <input
          id="forgot-email"
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      {message ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <button
        disabled={loading}
        className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <Divider />
      <GoogleAuthButton label="Continue with Google" />

      <p className="pt-2 text-sm text-slate-500 dark:text-slate-400">
        <Link className="font-medium text-violet-600 hover:underline dark:text-violet-300" href="/login">
          {"<-"} Back to login
        </Link>
      </p>
    </form>
  );
}
