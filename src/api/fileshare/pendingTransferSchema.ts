import { z } from "zod";
import { jsonStringifySchema } from "@/src/zod";

/** Shared shape for Halo 3 / ODST / Reach pending fileshare transfer list items. */
export const PendingTransferItemSchema = z.object({
  fileId: z.string(),
  fileName: z.string().nullable(),
  fileDescription: z.string().nullable(),
  fileAuthor: z.string().nullable(),
  fileType: z.number().nullable(),
  fileDate: z.union([z.string(), z.coerce.date()]).nullable(),
  shareId: z.string(),
  slot: z.number(),
  gameEngineType: z.number().nullable(),
  mapId: z.number().nullable().optional(),
  iconIndex: z.number().nullable().optional(),
});

export const PendingTransfersResponseSchema = jsonStringifySchema(
  z.object({
    transfers: z.array(PendingTransferItemSchema),
    maxTransfers: z.number(),
  }),
);

export type PendingTransferItem = z.infer<typeof PendingTransferItemSchema>;
export type PendingTransfersResponse = z.infer<typeof PendingTransfersResponseSchema>;
