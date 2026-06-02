import { publicProcedure } from "../trpc";
import { halo3Axios } from "../halo3/halo3Axios";
import { odstAxios } from "../odst/odstAxios";
import { reachAxios } from "../reach/reachAxios";
import { FileshareFilesResponseSchema } from "../halo3/fileshareFilesSchema";
import { FileshareFilesResponseSchema as ReachFileshareFilesResponseSchema } from "../reach/fileshareFilesSchema";
import type { FileshareFile as Halo3FileshareFile } from "../halo3/fileshareFilesSchema";
import type { FileshareFile as ReachFileshareFile } from "../reach/fileshareFilesSchema";
import { mergeByDateDesc } from "./mergeByDate";

const PER_GAME_FETCH = 4;
const DISPLAY_LIMIT = 4;

export type HomeRecentFile =
  | { game: "halo3"; file: Halo3FileshareFile }
  | { game: "odst"; file: Halo3FileshareFile }
  | { game: "reach"; file: ReachFileshareFile };

async function fetchRecentFiles(
  axios: typeof halo3Axios,
  path: string,
  game: "halo3" | "odst",
): Promise<HomeRecentFile[]> {
  try {
    const params = new URLSearchParams({
      page: "1",
      pageSize: String(PER_GAME_FETCH),
    });
    const response = await axios.get(`${path}?${params.toString()}`);
    const parsed = FileshareFilesResponseSchema.safeParse(response.data);
    if (!parsed.success) {
      return [];
    }
    return parsed.data.data.map((file: Halo3FileshareFile) => ({ game, file }));
  } catch {
    return [];
  }
}

async function fetchReachRecentFiles(): Promise<HomeRecentFile[]> {
  try {
    const params = new URLSearchParams({
      page: "1",
      pageSize: String(PER_GAME_FETCH),
    });
    const response = await reachAxios.get(`/haloreach/fileshare/files?${params.toString()}`);
    const parsed = ReachFileshareFilesResponseSchema.safeParse(response.data);
    if (!parsed.success) {
      return [];
    }
    return parsed.data.data.map((file: ReachFileshareFile) => ({ game: "reach" as const, file }));
  } catch {
    return [];
  }
}

export const recentFilesAcrossGames = publicProcedure.query(async (): Promise<HomeRecentFile[]> => {
  const [halo3, odst, reach] = await Promise.all([
    fetchRecentFiles(halo3Axios, "/halo3/fileshare/files", "halo3"),
    fetchRecentFiles(odstAxios, "/halo3odst/fileshare/files", "odst"),
    fetchReachRecentFiles(),
  ]);

  return mergeByDateDesc(
    [halo3, odst, reach],
    (item) => item.file.header.date,
    DISPLAY_LIMIT,
  );
});
