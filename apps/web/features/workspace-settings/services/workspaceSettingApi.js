const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
}

export const workspaceSettingApi = {
  getSettings: (workspaceId) =>
    request(`/api/workspace-settings/${workspaceId}`),

  updateSettings: (workspaceId, payload) =>
    request(`/api/workspace-settings/${workspaceId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};