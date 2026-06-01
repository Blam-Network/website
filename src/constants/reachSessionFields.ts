/** `session_game_mode` on LSP heartbeat session data (`e_game_mode` wire values). */
export const REACH_SESSION_GAME_MODE_LABELS: Record<number, string> = {
  0: "0",
  1: "1",
  2: "Main Menu",
  3: "Firefight",
  4: "4",
};

/** `network_session_privacy` inside `session_piracy_mode` (blf struct name). */
export const REACH_NETWORK_SESSION_PRIVACY_LABELS: Record<number, string> = {
  0: "0",
  1: "Open",
  2: "Friends Only",
  3: "Invite Only",
};

/** `network_session_closed_status` inside `session_piracy_mode`. */
export const REACH_NETWORK_SESSION_CLOSED_LABELS: Record<number, string> = {
  0: "No Session",
  1: "Joinable",
  2: "Playing Campaign",
  3: "Watching a Film",
  4: "In Matchmaking"
};

export function formatReachSessionGameMode(mode: number): string {
  return REACH_SESSION_GAME_MODE_LABELS[mode] ?? `Mode ${mode}`;
}

export function formatReachSessionPrivacyMode(
  privacy: number | null,
  closed: number | null,
): string | null {
  const parts: string[] = [];

  if (privacy != null) {
    parts.push(
      REACH_NETWORK_SESSION_PRIVACY_LABELS[privacy] ?? `Privacy ${privacy}`,
    );
  }

  if (closed != null) {
    parts.push(
      REACH_NETWORK_SESSION_CLOSED_LABELS[closed] ?? `Closed ${closed}`,
    );
  }

  return parts.length > 0 ? parts.join(" · ") : null;
}
