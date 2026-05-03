export function getPublicApiUrl() {
  const value = process.env.NEXT_PUBLIC_API_URL;
  if (!value) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }
  return value.replace(/\/+$/, "");
}

export function getPublicSocketUrl() {
  const value = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (!value) {
    throw new Error("NEXT_PUBLIC_SOCKET_URL is not configured");
  }
  return value.replace(/\/+$/, "");
}
