"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function InvalidResetLink() {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600">
        <RotateCcw className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">This reset link is invalid or expired</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Reset links are valid for 1 hour. Please request a new password reset link.
        </p>
      </div>

      <Link
        href="/forgot-password"
        className="inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
      >
        Request new reset link
      </Link>

      <Link href="/login" className="block text-sm font-medium text-violet-600 hover:underline">
        Back to login
      </Link>
    </div>
  );
}
