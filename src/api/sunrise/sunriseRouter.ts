import { Axios } from "axios";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { matchmakingPlaylists } from "./matchmakingPlaylists";
import { serviceRecord, serviceRecords } from "./serviceRecord";
import { playerScreenshots, screenshot, screenshots } from "./screenshots";
import { env } from "@/src/env";
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

export const sunriseAxios = new Axios({
    baseURL: env.HALO3_API_BASE_URL,
})