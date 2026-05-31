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

export function isValidFilesGame(value: string): value is FilesGame {
  return value === "halo3" || value === "odst" || value === "reach";
}

export function getFileshareFileHref(
  game: FilesGame,
  fileId: string,
  options?: { filesListQuery?: FilesListQuery; returnTo?: string },
): string {
  const base = `/files/${game}/${fileId}`;
  const returnTo =
    options?.returnTo ??
    (options?.filesListQuery ? buildFilesListHref(options.filesListQuery) : undefined);
  if (!returnTo) {
    return base;
  }
  return `${base}?returnTo=${encodeURIComponent(returnTo)}`;
}

export type FilesListQuery = {
  game: FilesGame;
  page?: string;
  fileType?: FileTypeFilter;
  search?: string;
};

export function buildFilesListHref(query: FilesListQuery): string {
  const params = new URLSearchParams();
  params.set("game", query.game);
  if (query.page && query.page !== "1") {
    params.set("page", query.page);
  }
  if (query.fileType) {
    params.set("fileType", query.fileType);
  }
  if (query.search?.trim()) {
    params.set("search", query.search.trim());
  }
  return `/files?${params.toString()}`;
}

export function parseFilesReturnTo(
  value: string | string[] | undefined,
  fallbackGame: FilesGame,
): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw?.startsWith("/files")) {
    const pathname = raw.split("?")[0];
    if (pathname === "/files") {
      return raw;
    }
  }
  return buildFilesListHref({ game: fallbackGame });
}

export function getFilesGameLabel(game: FilesGame): string {
  return FILES_GAMES.find((g) => g.value === game)?.label ?? "Halo 3";
}
