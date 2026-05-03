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

export const workspaceApi = {
  getWorkspaces: () => request("/api/workspaces"),

  createWorkspace: (data) =>
    request("/api/workspaces", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getWorkspace: (id) => request(`/api/workspaces/${id}`),
  getWorkspaceOverview: (id) => request(`/api/workspaces/${id}/overview`),

  updateWorkspace: (id, data) =>
    request(`/api/workspaces/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteWorkspace: (id) =>
    request(`/api/workspaces/${id}`, {
      method: "DELETE",
    }),

  inviteMember: (id, data) =>
    request(`/api/workspaces/${id}/invite`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateMemberRole: (workspaceId, memberId, role) =>
    request(`/api/workspaces/${workspaceId}/members/${memberId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),

  removeMember: (workspaceId, memberId) =>
    request(`/api/workspaces/${workspaceId}/members/${memberId}`, {
      method: "DELETE",
    }),
};
