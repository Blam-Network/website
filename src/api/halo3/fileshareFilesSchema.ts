import { z } from "zod";
import { jsonStringifySchema } from "@/src/zod";

const FileHeaderSchema = z.object({
  buildNumber: z.number(),
  mapVersion: z.number(),
  uniqueId: z.string(),
  filename: z.string(),
  description: z.string(),
  author: z.string(),
  filetype: z.number(),
  authorXuidIsOnline: z.boolean(),
  authorXuid: z.string(),
  size: z.number(),
  date: z.string(),
  lengthSeconds: z.number(),
  campaignId: z.number(),
  mapId: z.number(),
  gameEngineType: z.number(),
  campaignDifficulty: z.number(),
  hopperId: z.number(),
  gameId: z.number(),
  campaignInsertionPoint: z.number(),
  campaignSurvivalEnabled: z.boolean(),
});

export const FileShareFileSchema = z.object({
  id: z.string(),
  uniqueId: z.string(),
  slotNumber: z.number(),
  shareId: z.string(),
  uploader: z.string().optional(),
  uploaderXuid: z.string().optional(),
  header: FileHeaderSchema,
});

export const FileshareFileResponseSchema = jsonStringifySchema(FileShareFileSchema);

export const FileshareRelatedFilesResponseSchema = jsonStringifySchema(
  z.object({
    data: z.array(FileShareFileSchema),
  }),
);

export const FileshareTypeTotalsSchema = z.object({
  maps: z.number(),
  gametypes: z.number(),
  films: z.number(),
  screenshots: z.number(),
});

export const FileshareFilesResponseSchema = jsonStringifySchema(
  z.object({
    data: z.array(FileShareFileSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    totalsByType: FileshareTypeTotalsSchema.optional(),
  }),
);

export type FileshareTypeTotals = z.infer<typeof FileshareTypeTotalsSchema>;

export type FileshareFile = z.infer<typeof FileShareFileSchema>;

export { FileShareFileSchema as Halo3FileShareFileSchema };
