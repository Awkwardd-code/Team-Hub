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

export const announcementApi = {
  getAnnouncements: (workspaceId) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : "";
    return request(`/api/announcements${query}`);
  },

  createAnnouncement: (payload) =>
    request("/api/announcements", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateAnnouncement: (id, payload) =>
    request(`/api/announcements/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteAnnouncement: (id) =>
    request(`/api/announcements/${id}`, {
      method: "DELETE",
    }),

  createComment: (id, payload) =>
    request(`/api/announcements/${id}/comments`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  toggleReaction: (id, emoji) =>
    request(`/api/announcements/${id}/reactions`, {
      method: "POST",
      body: JSON.stringify({ emoji }),
    }),
};