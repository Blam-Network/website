import { z } from "zod";
import { protectedProcedure } from "../trpc";
import axios from "axios";

const AchievementsSchema = z.object({
    achievements: z.array(z.object({
        id: z.number(),
        titleId: z.number(),
        name: z.string(),
        sequence: z.number(),
        flags: z.number(),
        unlockedOnline: z.boolean(),
        unlocked: z.boolean(),
        isSecret: z.boolean(),
        platform: z.number(),
        gamerscore: z.number(),
        imageId: z.number(),
        description: z.string(),
        lockedDescription: z.string(),
        type: z.number(),
        isRevoked: z.boolean(),
        timeUnlocked: z.string().datetime({ offset: true }),
    }))
})

export const getVidmasters = protectedProcedure.query(async (opts) => {
    const halo3Response = await axios.get('https://achievements.xboxlive.com/users/xuid(' + opts.ctx.auth.user.xuid + ')/achievements?titleId=1297287142&unlockedOnly=true&maxItems=79', {
        headers: {
            'x-xbl-contract-version': '1',
            'Authorization': 'XBL3.0 x=' + opts.ctx.auth.user.xboxUserHash + ';' + opts.ctx.auth.tokens.xsts,
        }
    });
    const halo3Achievements = AchievementsSchema.parse(halo3Response.data).achievements;

    const halo3ODSTResponse = await axios.get('https://achievements.xboxlive.com/users/xuid(' + opts.ctx.auth.user.xuid + ')/achievements?titleId=1297287287&unlockedOnly=true&maxItems=47', {
        headers: {
            'x-xbl-contract-version': '1',
            'Authorization': 'XBL3.0 x=' + opts.ctx.auth.user.xboxUserHash + ';' + opts.ctx.auth.tokens.xsts,
        }
    });
    const halo3ODSTAchievements = AchievementsSchema.parse(halo3ODSTResponse.data).achievements;

    return {
        lightswitch: halo3Achievements.filter((a) => a.id == 91 && a.unlockedOnline).length > 0,
        sevenOnSeven: halo3Achievements.filter((a) => a.id == 92 && a.unlockedOnline).length > 0,
        annual: halo3Achievements.filter((a) => a.id == 63 && a.unlockedOnline).length > 0,
        brainpan: halo3Achievements.filter((a) => a.id == 90).length > 0,
        endure: halo3ODSTAchievements.filter((a) => a.id == 95 && a.unlockedOnline).length > 0,
        dejaVu: halo3ODSTAchievements.filter((a) => a.id == 96 && a.unlockedOnline).length > 0,
        classic: halo3ODSTAchievements.filter((a) => a.id == 97 && a.unlockedOnline).length > 0,
        halo3ODSTAchievements,
    }
});