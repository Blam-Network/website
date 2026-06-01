/**
 * Reach LSP session ids are 64-bit values (host `machine_id`), shown as 8-byte
 * big-endian hex with a colon between the upper and lower dwords.
 */
export function formatReachSessionId(sessionId: string): string | null {
  try {
    const value = BigInt(sessionId);
    if (value < 0n || value > 0xffff_ffff_ffff_ffffn) {
      return null;
    }

    const hex = value.toString(16).padStart(16, "0").toUpperCase();
    return `${hex.slice(0, 8)}:${hex.slice(8)}`;
  } catch {
    return null;
  }
}
