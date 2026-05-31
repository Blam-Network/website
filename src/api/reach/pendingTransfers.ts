import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { reachAxios } from "./reachAxios";
import { jsonStringifySchema } from "@/src/zod";
import { xuidToHex } from "@/src/utils/xuid";

const ReachPendingTransferSchema = z.object({
  fileId: z.string(),
  fileName: z.string().nullable(),
  fileDescription: z.string().nullable(),
  fileAuthor: z.string().nullable(),
  fileType: z.number().nullable(),
  fileDate: z.union([z.string(), z.coerce.date()]).nullable(),
  shareId: z.string(),
  slot: z.number(),
  gameEngineType: z.number().nullable(),
  iconIndex: z.number().nullable().optional(),
  mapId: z.number().nullable().optional(),
});

const ReachPendingTransfersResponseSchema = jsonStringifySchema(
  z.object({
    transfers: z.array(ReachPendingTransferSchema),
    maxTransfers: z.number(),
  }),
);

export type ReachPendingTransfer = z.infer<typeof ReachPendingTransferSchema>;
export type ReachPendingTransfersResponse = z.infer<typeof ReachPendingTransfersResponseSchema>;

export const reachPendingTransfers = protectedProcedure.query(async (opts) => {
  const response = await reachAxios.get("/haloreach/fileshare/transfers", {
    headers: {
      "x-xuid": xuidToHex(opts.ctx.auth.user.xuid),
      "x-uhs": opts.ctx.auth.user.xboxUserHash,
      Authorization: opts.ctx.auth.tokens.xsts,
    },
  });
  let data = response.data;
  if (typeof data === "string") {
    data = JSON.parse(data);
  }
  const parsed = ReachPendingTransfersResponseSchema.safeParse(data);
  if (!parsed.success) {
    console.error(
      "[reachPendingTransfers] Schema validation failed:",
      JSON.stringify(parsed.error.errors, null, 2),
    );
    throw new Error(`reachPendingTransfers: schema mismatch. got=${JSON.stringify(data).slice(0, 500)}`);
  }
  return parsed.data;
});
