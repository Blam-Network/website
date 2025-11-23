import { z } from "zod";
import { publicProcedure } from "../trpc";
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

const FileShareFileSchema = z.object({
    id: z.string(),
    uniqueId: z.string(),
    slotNumber: z.number(),
    shareId: z.string(),
    header: FileHeaderSchema,
});

const FileshareFilesResponseSchema = jsonStringifySchema(
    z.object({
        data: z.array(FileShareFileSchema),
        total: z.number(),
        page: z.number(),
        pageSize: z.number(),
        totalPages: z.number(),
    })
);

export type FileshareFile = z.infer<typeof FileShareFileSchema>;

export const fileshareFiles = publicProcedure.input(
    z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(48),
        fileType: z.enum(['maps', 'gametypes', 'films', 'screenshots']).optional(),
    })
).query(async ({ input }) => {
    const params = new URLSearchParams();
    params.set('page', String(input.page));
    params.set('pageSize', String(input.pageSize));
    if (input.fileType) {
        params.set('fileType', input.fileType);
    }
    
    const url = `/halo3/fileshare/files?${params.toString()}`;
    const response = await sunrise2Axios.get(url);
    const parsed = FileshareFilesResponseSchema.safeParse(response.data);
    if (!parsed.success) {
        throw new Error(`fileshareFiles: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
});

