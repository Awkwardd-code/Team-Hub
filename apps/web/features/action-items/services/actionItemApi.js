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

export const actionItemApi = {
  getActionItems: (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.workspaceId) params.set("workspaceId", filters.workspaceId);
    if (filters.goalId) params.set("goalId", filters.goalId);
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.assigneeId) params.set("assigneeId", filters.assigneeId);

    const query = params.toString() ? `?${params.toString()}` : "";

    return request(`/api/action-items${query}`);
  },

  createActionItem: (payload) =>
    request("/api/action-items", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateActionItem: (id, payload) =>
    request(`/api/action-items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteActionItem: (id) =>
    request(`/api/action-items/${id}`, {
      method: "DELETE",
    }),
};