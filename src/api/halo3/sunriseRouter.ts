import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { matchmakingPlaylists } from "./matchmakingPlaylists";
import { serviceRecord, serviceRecords } from "./serviceRecord";
import { playerScreenshots, screenshot, screenshots } from "./screenshots";
import { getXuid } from "./xuid";
import { fileShare } from "./fileShare";

export const sunriseRouter = createTRPCRouter({
  loggedIn: publicProcedure.query(async (opts) => {
    return opts.ctx.auth?.user.xuid ? "yes" : "no";
  }),
  matchmakingPlaylists,
  serviceRecord,
  serviceRecords,
  playerScreenshots,
  screenshot,
  screenshots,
  getXuid,
  fileShare,
});