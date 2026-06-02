import { env } from "@/src/env";

/**
 * Parse SITE_URL / NEXTAUTH_URL / TRPC_ORIGIN-style values into a stable origin.
 * Rejects common misconfigurations that yield a resolvable hostname of "http"
 * (e.g. NEXTAUTH_URL=http, or VERCEL_URL already containing https:// so that
 * `https://${VERCEL_URL}` becomes https://http://host/...).
 */
function parseEnvOrigin(raw: string | undefined): string | undefined {
  if (raw == null) return undefined;
  const trimmed = raw.trim().replace(/\/$/, "");
  if (trimmed === "") return undefined;
  try {
    const withScheme = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    const u = new URL(withScheme);
    if (!u.hostname) return undefined;
    if (u.hostname === "http" || u.hostname === "https") return undefined;
    return `${u.protocol}//${u.host}`;
  } catch {
    return undefined;
  }
}

/**
 * Returns the canonical base URL for the site.
 * Used for Open Graph, metadata, and server-to-server requests.
 * Set NEXTAUTH_URL (or SITE_URL) to your production URL with https://
 */
export function getSiteUrl(): string {
  if (typeof window !== "undefined") return "";
  const parsed = parseEnvOrigin(
    process.env.SITE_URL ?? process.env.NEXTAUTH_URL,
  );
  if (parsed) return parsed;
  if (process.env.NODE_ENV !== "development") {
    const vercelHost = process.env.VERCEL_URL?.replace(/^https?:\/\//i, "")
      .split("/")[0]
      ?.trim();
    if (vercelHost) {
      const fromVercel = parseEnvOrigin(`https://${vercelHost}`);
      if (fromVercel) return fromVercel;
    }
  }
  return `http://localhost:${env.PORT}`;
}

/** Prefer the incoming request host so og:image and canonical URLs match the public site. */
export async function getRequestSiteUrl(): Promise<string> {
  if (typeof window !== "undefined") return getSiteUrl();
  try {
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    if (host) {
      const proto =
        headersList.get("x-forwarded-proto") ??
        (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
      const origin = parseEnvOrigin(`${proto}://${host}`);
      if (origin) return origin;
    }
  } catch {
    // Outside a request (e.g. build); fall back to env-based URL.
  }
  return getSiteUrl();
}

/**
 * Base URL for server-side tRPC HTTP calls (RSC, route handlers).
 * In development this always targets this Next process, even when NEXTAUTH_URL
 * points at production (OAuth). Using getSiteUrl() there would call remote
 * /api/trpc and yield missing procedures like ares.* on an older deploy.
 */
export function getTrpcOrigin(): string {
  if (typeof window !== "undefined") return "";
  const override = parseEnvOrigin(process.env.TRPC_ORIGIN);
  if (override) return override;
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:${env.PORT}`;
  }
  const vercelHost = process.env.VERCEL_URL?.replace(/^https?:\/\//i, "")
    .split("/")[0]
    ?.trim();
  if (vercelHost) {
    const fromVercel = parseEnvOrigin(`https://${vercelHost}`);
    if (fromVercel) return fromVercel;
  }
  return getSiteUrl();
}
