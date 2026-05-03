"use client";

import { Camera } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AvatarUpload({ name, avatarUrl, selectedFile, onFileSelect, onFileRemove, onErrorChange, disabled }) {
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => {
    if (!selectedFile) return "";
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    if (onErrorChange) {
      onErrorChange(error);
    }
  }, [error, onErrorChange]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const displaySrc = previewUrl || avatarUrl || "";

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only PNG, JPG, and WEBP files are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be 2MB or less.");
      return;
    }

    setError("");
    onFileSelect(file);
  };

  const handleRemove = () => {
    setError("");
    onFileRemove();
  };

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="group relative h-32 w-32 overflow-hidden rounded-full border-4 border-violet-100 bg-violet-50 shadow-sm">
        {displaySrc ? (
          <img src={displaySrc} alt="Avatar preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-violet-700">
            {getInitials(name) || "U"}
          </div>
        )}

        <label className="absolute inset-0 hidden cursor-pointer items-center justify-center bg-black/35 text-sm font-semibold text-white group-hover:flex">
          Change
          <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleChange} disabled={disabled} />
        </label>
      </div>

      <div className="space-y-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
          <Camera className="h-4 w-4" />
          Upload new photo
          <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleChange} disabled={disabled} />
        </label>

        <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG or WEBP. Max 2MB.</p>

        {selectedFile ? (
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            disabled={disabled}
          >
            Remove selected preview
          </button>
        ) : null}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
