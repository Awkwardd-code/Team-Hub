import { requirePublicApiUrl } from "../../../lib/publicEnv";

async function request(path, options = {}) {
  const API_URL = requirePublicApiUrl();
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}

export async function getCurrentUserProfile() {
  return request("/api/auth/me");
}

export async function updateCurrentUserProfile({ name, avatarFile }) {
  const body = { name };

  if (avatarFile) {
    body.avatarDataUrl = await toDataUrl(avatarFile);
  }

  return request("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
