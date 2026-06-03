import type { FilesGame } from "@/src/components/files/filesPageTypes";

export type PlayersGame = "halo3" | "haloreach";

export const PLAYERS_BASE_PATH = "/players";

export const PLAYERS_GAMES = [
  { value: "halo3" as const, label: "Halo 3" },
  { value: "haloreach" as const, label: "Halo: Reach" },
];

export function parsePlayersGame(value: string | undefined): PlayersGame {
  if (value === "haloreach" || value === "reach") return "haloreach";
  return "halo3";
}

export function playersGameToFilesGame(game: PlayersGame): FilesGame {
  return game === "haloreach" ? "reach" : "halo3";
}

export function isReachPlayersGame(game: PlayersGame): boolean {
  return game === "haloreach";
}

export function getPlayersGameLabel(game: PlayersGame): string {
  return PLAYERS_GAMES.find((g) => g.value === game)?.label ?? "Halo 3";
}

export function getPlayersPageHref(
  game: PlayersGame,
  search?: string,
  page?: number,
): string {
  const params = new URLSearchParams();
  params.set("game", game);
  if (page && page > 1) params.set("page", String(page));
  if (search?.trim()) params.set("search", search.trim());
  return `${PLAYERS_BASE_PATH}?${params.toString()}`;
}
