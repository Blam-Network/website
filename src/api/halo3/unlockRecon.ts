import { protectedProcedure } from "../trpc";
import { halo3Axios } from "./halo3Axios";
import { xuidToHex } from "@/src/utils/xuid";

export const unlockRecon = protectedProcedure.mutation(async (opts) => {
    await halo3Axios.post('/halo3/unlock_recon', undefined, {
        headers: {
            'x-xuid': xuidToHex(opts.ctx.auth.user.xuid),
            'x-uhs': opts.ctx.auth.user.xboxUserHash,
            'Authorization': opts.ctx.auth.tokens.xsts,
        }
    });
});