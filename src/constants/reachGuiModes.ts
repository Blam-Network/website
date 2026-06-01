/** Reach presence `gui_game_mode` values from LSP heartbeat session data. */
export const REACH_GUI_MODE_LABELS: Record<number, string> = {
  0: "In Main Menu",
  1: "In Campaign",
  2: "In Matchmaking",
  3: "In Custom Games",
  4: "In Forge",
  5: "In Theater",
  6: "In Firefight",
};

export function formatReachGuiMode(mode: number): string {
  return REACH_GUI_MODE_LABELS[mode] ?? `GUI mode ${mode}`;
}
