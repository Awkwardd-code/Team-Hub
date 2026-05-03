import { requirePublicApiUrl } from "../../../lib/publicEnv";

async function request(path, options = {}) {
  const API_URL = requirePublicApiUrl();
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `API error: ${response.status}`);
  }

  return data;
}

export const authApi = {
  register: (payload) => request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  verifyEmail: (payload) => request("/api/auth/verify-email", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  me: () => request("/api/auth/me"),
  forgotPassword: (payload) => request("/api/auth/forgot-password", { method: "POST", body: JSON.stringify(payload) }),
  validateResetToken: (token) => request(`/api/auth/reset-password/validate?token=${encodeURIComponent(token)}`),
  resetPassword: (payload) => request("/api/auth/reset-password", { method: "POST", body: JSON.stringify(payload) }),
  resendVerificationCode: (payload) =>
    Promise.resolve({
      message: "TODO: wire /api/auth/resend-verification when backend is available.",
      email: payload?.email,
    }),
};
