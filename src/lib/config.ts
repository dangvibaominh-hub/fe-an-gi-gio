const DEFAULT_API_URL = "https://api-production-afd7.up.railway.app";

export function getApiBaseUrl(): string {
  const configuredUrl =
    process.env.NEXT_PUBLIC_API_URL?.trim() || DEFAULT_API_URL;

  return configuredUrl.replace(/\/$/, "");
}
