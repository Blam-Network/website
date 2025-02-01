import { protectedProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";

export const unlockRecon = protectedProcedure.mutation(async (opts) => {
    await sunrise2Axios.post('/blamnet/halo3/unlock_recon', undefined, {
        headers: {
            'x-xuid': opts.ctx.auth.user.xuid,
            'x-uhs': opts.ctx.auth.user.xboxUserHash,
            'Authorization': opts.ctx.auth.tokens.xsts,
        }
    });
});