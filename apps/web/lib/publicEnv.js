export function getPublicApiUrl() {
  const value = process.env.NEXT_PUBLIC_API_URL || "";
  return value.replace(/\/+$/, "");
}

export function getPublicSocketUrl() {
  const value = process.env.NEXT_PUBLIC_SOCKET_URL || "";
  return value.replace(/\/+$/, "");
}
