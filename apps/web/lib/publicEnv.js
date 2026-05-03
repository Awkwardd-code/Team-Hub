export function getPublicApiUrl() {
  const value = process.env.NEXT_PUBLIC_API_URL || "";
  return value.replace(/\/+$/, "");
}

export function getPublicSocketUrl() {
  const value = process.env.NEXT_PUBLIC_SOCKET_URL || "";
  return value.replace(/\/+$/, "");
}

export function requirePublicApiUrl() {
  const url = getPublicApiUrl();
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL is missing at build/deploy time.");
  }
  return url;
}

export function requirePublicSocketUrl() {
  const url = getPublicSocketUrl();
  if (!url) {
    throw new Error("NEXT_PUBLIC_SOCKET_URL is missing at build/deploy time.");
  }
  return url;
}
