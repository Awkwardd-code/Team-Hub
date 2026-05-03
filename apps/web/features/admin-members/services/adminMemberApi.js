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

export const adminMemberApi = {
  getOverview: () => request("/api/admin/members/overview"),
  getMembers: (workspaceId) =>
    request(`/api/admin/members/${workspaceId}/members`),

  inviteMember: (workspaceId, payload) =>
    request(`/api/admin/members/${workspaceId}/invite`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateMemberRole: (workspaceId, memberId, role) =>
    request(`/api/admin/members/${workspaceId}/members/${memberId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),

  removeMember: (workspaceId, memberId) =>
    request(`/api/admin/members/${workspaceId}/members/${memberId}`, {
      method: "DELETE",
    }),
};
