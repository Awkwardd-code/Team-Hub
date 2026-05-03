"use client";
import { getPublicApiUrl } from "../../../lib/publicEnv";

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.263 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.84 1.153 7.955 3.045l5.657-5.657C34.046 6.053 29.277 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 12 24 12c3.059 0 5.84 1.153 7.955 3.045l5.657-5.657C34.046 6.053 29.277 4 24 4c-7.682 0-14.417 4.337-17.694 10.691Z"/>
      <path fill="#4CAF50" d="M24 44c5.176 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.146 35.091 26.715 36 24 36c-5.243 0-9.623-3.318-11.283-7.946l-6.522 5.025C9.438 39.556 16.227 44 24 44Z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.042 12.042 0 0 1-4.084 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z"/>
    </svg>
  );
}

export default function GoogleAuthButton({ label = "Continue with Google" }) {
  const handleClick = () => {
    window.location.href = `${getPublicApiUrl()}/api/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      <GoogleLogo />
      <span>{label}</span>
    </button>
  );
}
