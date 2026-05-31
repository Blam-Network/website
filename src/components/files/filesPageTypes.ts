import type { FileshareDownloadGame } from "../FileshareDownloadButton";

export type FilesGame = FileshareDownloadGame;

export const FILES_GAMES = [
  { value: "halo3" as const, label: "Halo 3" },
  { value: "odst" as const, label: "Halo 3: ODST" },
  { value: "reach" as const, label: "Halo: Reach" },
];

const GAME_ICON_URLS: Record<FilesGame, string> = {
  halo3: "/img/game_icons/game_h3.svg",
  odst: "/img/game_icons/game_odst.svg",
  reach: "/img/game_icons/game_reach.svg",
};

export function getGameIconUrl(game: FilesGame): string {
  return GAME_ICON_URLS[game];
}

export const FILE_TYPE_FILTERS = [
  { value: "", label: "All" },
  { value: "maps", label: "Maps" },
  { value: "gametypes", label: "Gametypes" },
  { value: "films", label: "Films" },
  { value: "screenshots", label: "Screenshots" },
] as const;

export type FileTypeFilter = (typeof FILE_TYPE_FILTERS)[number]["value"];

const ODST_FILE_TYPE_FILTERS = [
  { value: "", label: "All" },
  { value: "films", label: "Films" },
  { value: "screenshots", label: "Screenshots" },
] as const satisfies readonly { value: FileTypeFilter; label: string }[];

export function getFileTypeFiltersForGame(game: FilesGame) {
  if (game === "odst") return ODST_FILE_TYPE_FILTERS;
  return FILE_TYPE_FILTERS;
}

export function isValidFileTypeForGame(game: FilesGame, fileType: FileTypeFilter): boolean {
  return getFileTypeFiltersForGame(game).some((filter) => filter.value === fileType);
}

export function parseFilesGame(value: string | undefined): FilesGame {
  if (value === "odst" || value === "reach") return value;
  return "halo3";
}

export function getFilesGameLabel(game: FilesGame): string {
  return FILES_GAMES.find((g) => g.value === game)?.label ?? "Halo 3";
}
