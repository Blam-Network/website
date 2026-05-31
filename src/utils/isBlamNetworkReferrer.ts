export function isBlamNetworkReferrer(referrer: string, currentOrigin?: string): boolean {
  if (!referrer) {
    return false;
  }

  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();

    if (host === "blam.network" || host.endsWith(".blam.network")) {
      return true;
    }

    if (currentOrigin && url.origin === currentOrigin) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
