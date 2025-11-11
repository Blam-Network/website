import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";
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
  
  const FileShareSlotSchema = z.object({
    id: z.string(),
    uniqueId: z.string(),
    slotNumber: z.number(),
    header: FileHeaderSchema,
  });
  
  const FileShareSchema = jsonStringifySchema(z.object({
    id: z.string(),
    ownerId: z.string(),
    visibleSlots: z.number(),
    quotaBytes: z.number(),
    quotaSlots: z.number(),
    subscriptionHash: z.number(),
    slots: z.array(FileShareSlotSchema),
  }));

export type FileShare = z.infer<typeof FileShareSchema>;

export const fileShare = publicProcedure.input(
    z.object({ gamertag: z.string().min(1) })
).query(async ({input}) => {
    const url = `/halo3/players/by-gamertag/${encodeURIComponent(input.gamertag)}/fileshare`;
    const response = await sunrise2Axios.get(url);
    const parsed = FileShareSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error(`fileShare: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
});
