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

export const auditLogApi = {
  getLogs: (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.workspaceId) params.set("workspaceId", filters.workspaceId);
    if (filters.entityType) params.set("entityType", filters.entityType);
    if (filters.action) params.set("action", filters.action);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);

    const query = params.toString() ? `?${params.toString()}` : "";

    return request(`/api/audit-logs${query}`);
  },

  exportCsv: (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.workspaceId) params.set("workspaceId", filters.workspaceId);
    if (filters.entityType) params.set("entityType", filters.entityType);
    if (filters.action) params.set("action", filters.action);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);

    const query = params.toString() ? `?${params.toString()}` : "";

    window.location.href = `${API_URL}/api/audit-logs/export${query}`;
  },
};