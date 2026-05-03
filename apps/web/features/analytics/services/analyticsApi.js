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

export const analyticsApi = {
  getOverview: (workspaceId) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : "";
    return request(`/api/analytics/overview${query}`);
  },
};