import { createTRPCRouter } from "../trpc";
import { getCarnageReport } from "./carnage-report";
import { getCampaignCarnageReport } from "./campaignCarnageReport";
import { serviceRecord, serviceRecords } from "./serviceRecord";
import { screenshot, screenshots, playerScreenshots } from "./screenshots";
import { fileShare } from "./fileShare";
import { fileshareFiles } from "./fileshareFiles";
import { games } from "./games";
import { playerPreviousGames } from "./previousGames";
import { playerStatistics } from "./playerStatistics";
import { activityHeatmap } from "./activityHeatmap";

export const aresRouter = createTRPCRouter({
  getCarnageReport,
  getCampaignCarnageReport,
  serviceRecord,
  serviceRecords,
  screenshot,
  screenshots,
  playerScreenshots,
  fileShare,
  fileshareFiles,
  games,
  playerPreviousGames,
  playerStatistics,
  activityHeatmap,
});

export { aresAxios } from "./aresAxios";
