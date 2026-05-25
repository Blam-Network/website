import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";

function resolveRequestUrl(baseURL: string | undefined, url: string | undefined): string {
  if (!url && !baseURL) return "";
  if (!url) return baseURL ?? "";
  if (!baseURL) return url;
  try {
    return new URL(url, baseURL.endsWith("/") ? baseURL : `${baseURL}/`).href;
  } catch {
    const b = baseURL.replace(/\/+$/, "");
    const u = url.startsWith("/") ? url : `/${url}`;
    return `${b}${u}`;
  }
}

type AxiosLike = Pick<typeof axios, "interceptors">;

export function attachAxiosRequestLogging(client: AxiosLike, label: string): void {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const method = (config.method ?? "get").toUpperCase();
    const full = resolveRequestUrl(config.baseURL, config.url);
    console.log(`[axios:${label}] ${method} ${full}`);
    return config;
  });
}

let defaultAxiosLoggingInstalled = false;

/** Registers logging on the default `axios` instance (e.g. Xbox Live). Safe across hot reload. */
export function installDefaultAxiosRequestLoggingOnce(): void {
  if (defaultAxiosLoggingInstalled) return;
  defaultAxiosLoggingInstalled = true;
  attachAxiosRequestLogging(axios, "default");
}
