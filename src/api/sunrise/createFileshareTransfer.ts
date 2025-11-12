import { protectedProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";
import { z } from "zod";
import { xuidToHex } from "@/src/utils/xuid";

export const createFileshareTransfer = protectedProcedure.input(
    z.object({ fileId: z.string().uuid() })
).mutation(async (opts) => {
    await sunrise2Axios.post('/halo3/fileshare/transfer', JSON.stringify({ fileId: opts.input.fileId }), {
        headers: {
            'Content-Type': 'application/json',
            'x-xuid': xuidToHex(opts.ctx.auth.user.xuid),
            'x-uhs': opts.ctx.auth.user.xboxUserHash,
            'Authorization': opts.ctx.auth.tokens.xsts,
        }
    });
});

