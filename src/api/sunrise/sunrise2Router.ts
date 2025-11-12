import { Axios } from "axios";

import { createTRPCRouter } from "../trpc";
import { env } from "@/src/env";
import { getCarnageReport } from "./carnage-report";
import { unlockRecon } from "./unlockRecon";
import { playerPreviousGames } from "./previousGames";
import { createFileshareTransfer } from "./createFileshareTransfer";
import { deleteFileshareTransfer } from "./deleteFileshareTransfer";
import { recentGames, games } from "./recentGames";
import { recentScreenshots } from "./recentScreenshots";
import { onlinePlayers } from "./onlinePlayers";
import { onlinePlayers24h } from "./onlinePlayers24h";
import { getRelatedFiles } from "./relatedFiles";
import { getScreenshotByFileshare } from "./getScreenshotByUniqueId";
import { getCampaignCarnageReport } from "./campaignCarnageReport";
import { pendingTransfers } from "./pendingTransfers";

export const sunrise2Router = createTRPCRouter({
  unlockRecon,
  getCarnageReport,
  getCampaignCarnageReport,
  playerPreviousGames,
  createFileshareTransfer,
  deleteFileshareTransfer,
  recentGames,
  games,
  recentScreenshots,
  onlinePlayers,
  onlinePlayers24h,
  getRelatedFiles,
  getScreenshotByFileshare,
  pendingTransfers,
});

export const sunrise2Axios = new Axios({
    baseURL: env.HALO3_API_BASE_URL,
})