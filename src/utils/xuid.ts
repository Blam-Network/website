/**
 * Converts a XUID from decimal string or BigInt to hex string (16 characters, uppercase, zero-padded)
 * @param xuid - XUID in decimal string format (e.g., "2535457702870641") or BigInt
 * @returns XUID in hex string format (e.g., "000901FC3FB8FE71")
 */
export function xuidToHex(xuid: string | bigint): string {
    // If it's already a BigInt, convert directly
    if (typeof xuid === 'bigint') {
        return xuid.toString(16).toUpperCase().padStart(16, '0');
    }
    
    const trimmed = xuid.trim();
    
    // If it's 16 characters and contains hex letters (a-f), it's already hex
    if (/^[0-9a-fA-F]{16}$/.test(trimmed) && /[a-fA-F]/.test(trimmed)) {
        return trimmed.toUpperCase().padStart(16, '0');
    }
    
    // Otherwise, treat as decimal string and convert to hex
    const decimal = BigInt(trimmed);
    return decimal.toString(16).toUpperCase().padStart(16, '0');
}

