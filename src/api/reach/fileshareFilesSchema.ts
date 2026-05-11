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

const FileShareFileSchema = z.object({
  id: z.string(),
  uniqueId: z.string(),
  slotNumber: z.number(),
  shareId: z.string(),
  header: FileHeaderSchema,
});

export const FileshareFilesResponseSchema = jsonStringifySchema(
  z.object({
    data: z.array(FileShareFileSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  }),
);

export type FileshareFile = z.infer<typeof FileShareFileSchema>;
