import type { FilesGame } from "@/src/components/files/filesPageTypes";
import { env } from "@/src/env";

export function getScreenshotViewUrl(game: FilesGame, id: string): string {
  switch (game) {
    case "odst":
      return `${env.NEXT_PUBLIC_HALO3_API_BASE_URL}/halo3odst/screenshots/${id}/view`;
    case "reach":
      return `${env.NEXT_PUBLIC_HALO_REACH_API_BASE_URL}/haloreach/screenshots/${id}/view`;
    default:
      return `${env.NEXT_PUBLIC_HALO3_API_BASE_URL}/halo3/screenshots/${id}/view`;
  }
}
