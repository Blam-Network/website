import { createTRPCRouter } from "../trpc";
import { getCarnageReport } from "./ares/carnage-report";
import { getCampaignCarnageReport } from "./ares/campaignCarnageReport";
import { serviceRecord, serviceRecords } from "./ares/serviceRecord";
import { screenshot, screenshots, playerScreenshots } from "./ares/screenshots";
import { fileShare } from "./ares/fileShare";
import { fileshareFiles } from "./ares/fileshareFiles";
import { games } from "./ares/games";
import { playerPreviousGames } from "./ares/previousGames";
import { playerStatistics } from "./ares/playerStatistics";
import { activityHeatmap } from "./ares/activityHeatmap";

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