import { env } from "@/src/env";
import type { FilesGame } from "@/src/components/files/filesPageTypes";

export function isFileshareScreenshotFile(game: FilesGame, filetype: number): boolean {
  return game === "reach" ? filetype === 2 : filetype === 13;
}

export function getFileshareScreenshotViewUrl(
  game: FilesGame,
  shareId: string,
  options: { filetype: number; slotNumber: number; fileId: string },
): string | null {
  if (!isFileshareScreenshotFile(game, options.filetype)) {
    return null;
  }

  const hexShareId = BigInt(shareId).toString(16).toUpperCase().padStart(16, "0");

  if (game === "reach") {
    return `${env.NEXT_PUBLIC_HALO_REACH_API_BASE_URL}/haloreach/fileshare/${hexShareId}/${options.fileId}/view`;
  }

  const apiPath = game === "odst" ? "halo3odst" : "halo3";
  return `${env.NEXT_PUBLIC_HALO3_API_BASE_URL}/${apiPath}/fileshare/${hexShareId}/${options.slotNumber}/view`;
}
