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

export const milestoneApi = {
  getMilestones: ({ workspaceId, goalId, status } = {}) => {
    const params = new URLSearchParams();

    if (workspaceId) params.set("workspaceId", workspaceId);
    if (goalId) params.set("goalId", goalId);
    if (status) params.set("status", status);

    const query = params.toString() ? `?${params.toString()}` : "";

    return request(`/api/milestones${query}`);
  },

  createMilestone: (payload) =>
    request("/api/milestones", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateMilestone: (id, payload) =>
    request(`/api/milestones/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteMilestone: (id) =>
    request(`/api/milestones/${id}`, {
      method: "DELETE",
    }),
};