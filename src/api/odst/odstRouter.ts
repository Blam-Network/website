import { createTRPCRouter } from "../trpc";
import { screenshot, screenshots, playerScreenshots } from "./screenshots";
import { fileshareFiles } from "./fileshareFiles";
import { createFileshareTransfer } from "./createFileshareTransfer";
import { deleteFileshareTransfer } from "./deleteFileshareTransfer";
import { pendingTransfers } from "./pendingTransfers";

export const odstRouter = createTRPCRouter({
  screenshot,
  screenshots,
  playerScreenshots,
  fileshareFiles,
  createFileshareTransfer,
  deleteFileshareTransfer,
  pendingTransfers,
});
