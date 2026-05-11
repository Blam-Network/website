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

/**
 * Base URL for server-side tRPC HTTP calls (RSC, route handlers).
 * In development this always targets this Next process, even when NEXTAUTH_URL
 * points at production (OAuth). Using getSiteUrl() there would call remote
 * /api/trpc and yield missing procedures like ares.* on an older deploy.
 */
export function getTrpcOrigin(): string {
  if (typeof window !== "undefined") return "";
  const override = process.env.TRPC_ORIGIN?.replace(/\/$/, "");
  if (override) return override;
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:${env.PORT}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return getSiteUrl();
}
