/** Parse Nest/JSON error bodies from Axios responses (validateStatus: always true). */
export function getAxiosErrorMessage(response: { status: number; data?: unknown }): string {
  let data = response.data;
  if (typeof data === "string") {
    const raw = data;
    try {
      data = JSON.parse(raw) as unknown;
    } catch {
      return raw.trim() || `Request failed (${response.status})`;
    }
  }
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message?: string | string[] }).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string" && message.length > 0) return message;
  }
  return `Request failed (${response.status})`;
}

export function assertAxiosOk(response: { status: number; data?: unknown }): void {
  if (response.status >= 400) {
    throw new Error(getAxiosErrorMessage(response));
  }
}
