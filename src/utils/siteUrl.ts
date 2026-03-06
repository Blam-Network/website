import { env } from "@/src/env";

/**
 * Returns the canonical base URL for the site.
 * Used for Open Graph, metadata, and server-to-server requests.
 * Set NEXTAUTH_URL (or SITE_URL) to your production URL with https://
 */
export function getSiteUrl(): string {
  if (typeof window !== "undefined") return "";
  const url =
    process.env.SITE_URL ??
    process.env.NEXTAUTH_URL;
  if (url) {
    return url.replace(/\/$/, "");
  }
  return `http://localhost:${env.PORT}`;
}
