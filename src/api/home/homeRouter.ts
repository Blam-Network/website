import { createTRPCRouter } from "../trpc";
import { recentScreenshotsAcrossGames } from "./recentScreenshotsAcrossGames";
import { recentFilesAcrossGames } from "./recentFilesAcrossGames";
import { serviceHealth } from "./serviceHealth";

export const homeRouter = createTRPCRouter({
  recentScreenshotsAcrossGames,
  recentFilesAcrossGames,
  serviceHealth,
});
