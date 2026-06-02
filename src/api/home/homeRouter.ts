import { createTRPCRouter } from "../trpc";
import { recentScreenshotsAcrossGames } from "./recentScreenshotsAcrossGames";
import { recentFilesAcrossGames } from "./recentFilesAcrossGames";

export const homeRouter = createTRPCRouter({
  recentScreenshotsAcrossGames,
  recentFilesAcrossGames,
});
