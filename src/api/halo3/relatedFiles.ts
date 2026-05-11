import { z } from "zod";
import { publicProcedure } from "../trpc";
import { halo3Axios } from "./halo3Axios";
import { jsonStringifySchema } from "@/src/zod";

const FileShareSlotSchema = z.object({
    id: z.string(),
    uniqueId: z.string(),
    slotNumber: z.number(),
    shareId: z.string(),
    header: z.object({
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
    }),
});

const ScreenshotSchema = z.object({
    id: z.string(),
    header: z.object({
        filename: z.string(),
        description: z.string(),
    }),
    author: z.string(),
    date: z.coerce.date(),
});

const RelatedFilesResponseSchema = jsonStringifySchema(
    z.object({
        fileshare: z.array(FileShareSlotSchema),
        screenshots: z.array(ScreenshotSchema),
    })
);

export const getRelatedFiles = publicProcedure.input(
    z.object({ id: z.string().uuid() })
).query(async (opts) => {
    const response = await halo3Axios.get(`/halo3/carnage-reports/${opts.input.id}/related-files`);
    const data = RelatedFilesResponseSchema.parse(response.data);
    return data;
});

