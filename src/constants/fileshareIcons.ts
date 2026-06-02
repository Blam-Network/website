const FILESHARE_BASE = "/img/fileshare";

export type FileshareFrameKind =
  | "screenshot"
  | "film"
  | "film_clip"
  | "map"
  | "gametype";

export function getFileshareMaskUrl(kind: FileshareFrameKind): string {
  return `${FILESHARE_BASE}/reach_file_${kind === "film_clip" ? "film_clip" : kind}_mask.png`;
}

export function getFileshareOverlayUrl(kind: FileshareFrameKind): string {
  return `${FILESHARE_BASE}/reach_file_${kind === "film_clip" ? "film_clip" : kind}_overlay.png`;
}

/** Halo 3 / ODST: screenshot=13, film=11, clip=12, map=10, gametype=<10 */
export function getHalo3FileshareFrameKind(filetype: number): FileshareFrameKind {
  if (filetype === 13) return "screenshot";
  if (filetype === 11) return "film";
  if (filetype === 12) return "film_clip";
  if (filetype === 10) return "map";
  return "gametype";
}

/** Reach: screenshot=2, film=3, clip=4, map=5, gametype=6 */
export function getReachFileshareFrameKind(filetype: number): FileshareFrameKind {
  switch (filetype) {
    case 2:
      return "screenshot";
    case 3:
      return "film";
    case 4:
      return "film_clip";
    case 5:
      return "map";
    case 6:
      return "gametype";
    default:
      return "gametype";
  }
}

export function getHalo3MapImageUrl(mapId: number): string {
  return `/img/largemaps/${mapId}.jpg`;
}

export function getReachMapImageUrl(mapId: number): string {
  return `${FILESHARE_BASE}/maps/reach_${mapId}.jpg`;
}

export function halo3FiletypeShowsMapImage(filetype: number): boolean {
  return filetype === 10 || filetype === 11 || filetype === 12;
}

export function halo3FiletypeShowsGametypeImage(filetype: number): boolean {
  return filetype < 10;
}

export function reachFiletypeShowsMapImage(filetype: number): boolean {
  return filetype === 3 || filetype === 4 || filetype === 5;
}

export function reachFiletypeShowsGametypeImage(filetype: number): boolean {
  return filetype === 6;
}

export function getReachGametypeIconUrl(iconIndex: number): string {
  const index = Math.max(0, Math.min(38, iconIndex));
  return `${FILESHARE_BASE}/gametypes/reach_gameypes_large_ui_${String(index).padStart(2, "0")}_00.png`;
}

/**
 * Halo 3 `e_game_engine` (stored as fileshare `game_engine_type`) → Reach icon index.
 * @see blf_lib halo3 game_engine_variant::e_game_engine
 */
export const HALO3_GAME_ENGINE_TO_REACH_ICON: Record<number, number> = {
  1: 0, // ctf
  2: 1, // slayer
  3: 2, // oddball
  4: 3, // king (KOTH)
  5: 38, // sandbox (Forge)
  6: 8, // vip
  7: 4, // juggernaut
  8: 5, // territories
  9: 6, // assault
  10: 7, // infection
};

/** Website filetype (1–9) when `game_engine_type` is missing. */
export const HALO3_FILETYPE_TO_REACH_ICON: Record<number, number> = {
  1: 0, // CTF
  2: 1, // Slayer
  3: 2, // Oddball
  4: 3, // KOTH
  5: 4, // Juggernaut
  6: 5, // Territories
  7: 6, // Assault
  8: 7, // Infection
  9: 8, // VIP
};

export function halo3GameEngineToReachIconIndex(
  gameEngineType: number,
): number | null {
  return HALO3_GAME_ENGINE_TO_REACH_ICON[gameEngineType] ?? null;
}

export function halo3FiletypeToReachIconIndex(
  filetype: number,
): number | null {
  return HALO3_FILETYPE_TO_REACH_ICON[filetype] ?? null;
}

const GAMETYPE_ICON_WIDTH = "35%";

export function getReachGametypeLayerStyle(): Record<string, string | number> {
  return {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: GAMETYPE_ICON_WIDTH,
    height: "auto",
    aspectRatio: "1 / 1",
    objectFit: "contain",
  };
}

export type FileshareMiniIconKind = "maps" | "gametypes" | "films" | "screenshots";

const FILESHARE_MINI_ICONS: Record<FileshareMiniIconKind, string> = {
  maps: `${FILESHARE_BASE}/mini_icon_map.png`,
  gametypes: `${FILESHARE_BASE}/mini_icon_gametype.png`,
  films: `${FILESHARE_BASE}/mini_icon_film.png`,
  screenshots: `${FILESHARE_BASE}/mini_icon_screenshot.png`,
};

export function getFileTypeMiniIconUrl(
  fileType: string,
): string | null {
  if (fileType in FILESHARE_MINI_ICONS) {
    return FILESHARE_MINI_ICONS[fileType as FileshareMiniIconKind];
  }
  return null;
}
