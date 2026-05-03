"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../services/authApi";
import { useAuthStore } from "../../../store/authStore";
import GoogleAuthButton from "./GoogleAuthButton";
import EmailVerificationModal from "./EmailVerificationModal";

function Divider() {
  return (
    <div className="my-3 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      <span>or</span>
      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (form.password !== form.confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      await authApi.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (code) => {
    setVerifyLoading(true);
    setVerifyError("");

    try {
      const data = await authApi.verifyEmail({
        email: form.email,
        code,
      });
      setUser(data.user);
      setIsModalOpen(false);
      router.push("/dashboard");
    } catch (err) {
      setVerifyError(err.message || "Verification failed.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResend = async () => {
    // TODO: replace with dedicated resend endpoint once backend adds support.
    // Current fallback intentionally does not call register again to avoid duplicate user creation.
    return authApi.resendVerificationCode({ email: form.email });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Sign up</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Creating your account...</p>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Sign up</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Create an account to get started</p>

        <div className="pt-1">
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Full name</label>
          <input
            placeholder="John Doe"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Confirm password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
            minLength={6}
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          disabled={loading}
          className="mt-1 w-full rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:opacity-95"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <Divider />

        <div className="space-y-2">
          <GoogleAuthButton label="Sign up with Google" />
        </div>

        <p className="pt-1 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link className="font-medium text-sky-600 hover:underline" href="/login">
            Login
          </Link>
        </p>
      </form>

      <EmailVerificationModal
        isOpen={isModalOpen}
        email={form.email}
        onClose={() => setIsModalOpen(false)}
        onVerify={handleVerify}
        onResend={handleResend}
        loading={verifyLoading}
        serverError={verifyError}
      />
    </>
  );
}
