import { z } from "zod";
import { jsonStringifySchema } from "@/src/zod";

export const FileshareSourceGameSchema = z.object({
  reportType: z.enum(["multiplayer", "campaign"]),
  reportId: z.string().uuid(),
  mapId: z.number(),
  startTime: z.string(),
  finishTime: z.string(),
  teamGame: z.boolean(),
  mapVariantName: z.string().nullable(),
  gameVariantName: z.string().nullable(),
  hopperName: z.string().nullable(),
  campaignDifficulty: z.number().optional(),
  campaignId: z.number().optional(),
});

export const FileshareSourceGameResponseSchema = jsonStringifySchema(
  z.object({
    sourceGame: FileshareSourceGameSchema.nullable(),
  }),
);

export type FileshareSourceGame = z.infer<typeof FileshareSourceGameSchema>;
