"use client";

import { Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function EmailVerificationModal({
  isOpen,
  email,
  onClose,
  onVerify,
  onResend,
  loading,
  serverError,
}) {
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [localError, setLocalError] = useState("");
  const [resendMsg, setResendMsg] = useState("");

  const isExpired = timeLeft <= 0;
  const canVerify = !loading && !isExpired && code.trim().length === 6;

  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft(300);
    setCode("");
    setLocalError("");
    setResendMsg("");

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLocalError("");

    const normalizedCode = code.replace(/\D/g, "");
    if (normalizedCode.length !== 6) {
      setLocalError("Please enter a valid 6-digit code.");
      return;
    }

    await onVerify(normalizedCode);
  };

  const handleResend = async () => {
    setLocalError("");
    setResendMsg("");
    await onResend();
    setTimeLeft(300);
    setCode("");
    setResendMsg("A new code has been sent if your email is eligible.");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/45 p-4 backdrop-blur-sm">
      <div className="mx-auto my-8 w-full max-w-md rounded-3xl border border-violet-100 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 md:p-7">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Verify your email</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">We sent a 6-digit code to your email.</p>
        <p className="mt-1 text-sm font-medium text-violet-700">{email}</p>

        <form onSubmit={handleVerify} className="mt-5 space-y-4">
          <div>
            <label htmlFor="email-code" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Verification code
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="email-code"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                disabled={loading}
                required
              />
            </div>
          </div>

          <p className={`text-sm ${isExpired ? "text-red-600 dark:text-red-300" : "text-slate-600 dark:text-slate-300"}`}>
            {isExpired ? "Code expired. Please request a new code." : `Code expires in ${formatTime(timeLeft)}`}
          </p>

          {localError ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">{localError}</p> : null}
          {serverError ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-300">{serverError}</p> : null}
          {resendMsg ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{resendMsg}</p> : null}

          <button
            type="submit"
            disabled={!canVerify}
            className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition enabled:hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          className="mt-3 text-sm font-medium text-violet-600 transition hover:underline"
        >
          Resend code
        </button>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">TODO: Hook this to a dedicated resend endpoint when available.</p>
      </div>
    </div>
  );
}
