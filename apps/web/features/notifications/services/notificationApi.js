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

export const notificationApi = {
  getNotifications: () => request("/api/notifications"),
  markRead: (id) => request(`/api/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => request("/api/notifications/read-all", { method: "PATCH" }),
  deleteNotification: (id) => request(`/api/notifications/${id}`, { method: "DELETE" }),
};
