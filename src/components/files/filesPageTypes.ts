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

const FILES_GAME_PATH_SEGMENT: Record<FilesGame, string> = {
  halo3: "halo3",
  odst: "halo3odst",
  reach: "haloreach",
};

export function getFilesGamePathSegment(game: FilesGame): string {
  return FILES_GAME_PATH_SEGMENT[game];
}

export function parseFilesGameFromPathSegment(segment: string): FilesGame | null {
  if (segment === "halo3odst") return "odst";
  if (segment === "haloreach") return "reach";
  if (segment === "halo3") return "halo3";
  return null;
}

/** e.g. `/haloreach/file/abc` → `reach`; legacy `/files/odst/abc` → `odst` */
export function parseFilesGameFromFilePagePathname(pathname: string): FilesGame | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "files" && parts[1] && isValidFilesGame(parts[1])) {
    return parts[1];
  }
  return parseFilesGameFromPathSegment(parts[0] ?? "");
}

export function getFileshareFileHref(game: FilesGame, fileId: string): string {
  return `/${getFilesGamePathSegment(game)}/file/${encodeURIComponent(fileId)}`;
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

export function getFilesGameLabel(game: FilesGame): string {
  return FILES_GAMES.find((g) => g.value === game)?.label ?? "Halo 3";
}
