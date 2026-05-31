import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { odstAxios } from "./odstAxios";
import { jsonStringifySchema } from "@/src/zod";
import { xuidToHex } from "@/src/utils/xuid";

const PendingTransferSchema = z.object({
  fileId: z.string().uuid(),
  fileName: z.string().nullable(),
  fileDescription: z.string().nullable(),
  fileAuthor: z.string().nullable(),
  fileType: z.number(),
  fileDate: z.coerce.date().nullable(),
  shareId: z.string(),
  slot: z.number(),
  gameEngineType: z.number().nullable(),
  mapId: z.number().nullable().optional(),
});

const PendingTransfersResponseSchema = jsonStringifySchema(
  z.object({
    transfers: z.array(PendingTransferSchema),
    maxTransfers: z.number(),
  }),
);

export type OdstPendingTransfer = z.infer<typeof PendingTransferSchema>;
export type OdstPendingTransfersResponse = z.infer<typeof PendingTransfersResponseSchema>;

export const pendingTransfers = protectedProcedure.query(async (opts) => {
  const response = await odstAxios.get("/halo3odst/fileshare/transfers", {
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
  const parsed = PendingTransfersResponseSchema.safeParse(data);
  if (!parsed.success) {
    console.error("[odst pendingTransfers] Schema validation failed:", JSON.stringify(parsed.error.errors, null, 2));
    throw new Error(`pendingTransfers: schema mismatch. got=${JSON.stringify(data).slice(0, 500)}`);
  }
  return parsed.data;
});
