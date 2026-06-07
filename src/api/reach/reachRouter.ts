import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { FileshareFilesResponseSchema } from "./fileshareFilesSchema";
import { ScreenshotsResponseSchema } from "./screenshotsSchema";
import { reachAxios } from "./reachAxios";
import { reachPendingTransfers } from "./pendingTransfers";
import { reachCreateFileshareTransfer } from "./createFileshareTransfer";
import { reachDeleteFileshareTransfer } from "./deleteFileshareTransfer";
import { onlinePlayers } from "./onlinePlayers";
import { onlinePlayers24h } from "./onlinePlayers24h";
import { lobbies } from "./lobbies";
import { hoppers } from "./hoppers";
import { serviceRecord, serviceRecords } from "./serviceRecord";
import { fileShare } from "./fileShare";
import { getNameplates } from "./getNameplates";
import { setReachNameplate } from "./setReachNameplate";
import { getArmourUnlocks } from "./getArmourUnlocks";
import { unlockReachArmour } from "./unlockReachArmour";

const screenshots = publicProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1).optional(),
      pageSize: z.number().min(1).default(48).optional(),
      gamertag: z.string().optional(),
    }),
  )
  .query(async (opts) => {
    const page = opts.input.page ?? 1;
    const pageSize = opts.input.pageSize ?? 48;
    const gamertag = opts.input.gamertag;

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    if (gamertag) {
      params.set("gamertag", gamertag);
    }

    const response = await reachAxios.get(`/haloreach/screenshots?${params.toString()}`);
    const parsed = ScreenshotsResponseSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error(`reach.screenshots: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
  });

const fileshareFiles = publicProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(50),
      fileType: z.enum(["maps", "gametypes", "films", "screenshots"]).optional(),
      search: z.string().optional(),
    }),
  )
  .query(async ({ input }) => {
    const params = new URLSearchParams();
    params.set("page", String(input.page));
    params.set("pageSize", String(input.pageSize));
    if (input.fileType) {
      params.set("fileType", input.fileType);
    }
    if (input.search?.trim()) {
      params.set("search", input.search.trim());
    }
    const response = await reachAxios.get(`/haloreach/fileshare/files?${params.toString()}`);
    const parsed = FileshareFilesResponseSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error(`reach.fileshareFiles: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
  });

export const reachRouter = createTRPCRouter({
  onlinePlayers,
  onlinePlayers24h,
  hoppers,
  lobbies,
  screenshots,
  fileshareFiles,
  serviceRecord,
  serviceRecords,
  fileShare,
  pendingTransfers: reachPendingTransfers,
  createFileshareTransfer: reachCreateFileshareTransfer,
  deleteFileshareTransfer: reachDeleteFileshareTransfer,
  getNameplates,
  setReachNameplate,
  getArmourUnlocks,
  unlockReachArmour,
});
