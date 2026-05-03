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

export const goalApi = {
  getGoals: (workspaceId) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : "";
    return request(`/api/goals${query}`);
  },

  createGoal: (payload) =>
    request("/api/goals", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateGoal: (id, payload) =>
    request(`/api/goals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteGoal: (id) =>
    request(`/api/goals/${id}`, {
      method: "DELETE",
    }),

  createMilestone: (goalId, payload) =>
    request(`/api/goals/${goalId}/milestones`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  createGoalUpdate: (goalId, payload) =>
    request(`/api/goals/${goalId}/updates`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};