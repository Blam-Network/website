import type { FilesGame } from "@/src/components/files/filesPageTypes";

/** Whether a file type may have carnage-report game context (screenshots and films). */
export function isFileshareSourceGameCandidate(game: FilesGame, filetype: number): boolean {
  switch (game) {
    case "reach":
      return filetype === 2 || filetype === 3 || filetype === 4;
    case "odst":
      return filetype === 13 || filetype === 11 || filetype === 12;
    default:
      return filetype === 13 || filetype === 11 || filetype === 12;
  }
}
