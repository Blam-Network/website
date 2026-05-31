import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { halo3Axios } from "./halo3Axios";
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

const PendingTransfersResponseSchema = jsonStringifySchema(z.object({
    transfers: z.array(PendingTransferSchema),
    maxTransfers: z.number(),
}));

export type PendingTransfer = z.infer<typeof PendingTransferSchema>;
export type PendingTransfersResponse = z.infer<typeof PendingTransfersResponseSchema>;

export const pendingTransfers = protectedProcedure.query(async (opts) => {
    const response = await halo3Axios.get('/halo3/fileshare/transfers', {
        headers: {
            'x-xuid': xuidToHex(opts.ctx.auth.user.xuid),
            'x-uhs': opts.ctx.auth.user.xboxUserHash,
            'Authorization': opts.ctx.auth.tokens.xsts,
        }
    });
    // Handle Axios response - data might be a string that needs parsing
    let data = response.data;
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }
    const parsed = PendingTransfersResponseSchema.safeParse(data);
    if (!parsed.success) {
        console.error('[pendingTransfers] Schema validation failed:', JSON.stringify(parsed.error.errors, null, 2));
        throw new Error(`pendingTransfers: schema mismatch. got=${JSON.stringify(data).slice(0, 500)}`);
    }
    return parsed.data;
});

