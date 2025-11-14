import { z } from "zod";
import { publicProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";
import { jsonStringifySchema } from "@/src/zod";

const PlayerStatisticsSchema = jsonStringifySchema(z.object({
    gameTypes: z.array(z.object({
        name: z.string(),
        value: z.number(),
    })),
    killsDeaths: z.array(z.object({
        name: z.string(),
        value: z.number(),
    })),
    mostKilled: z.array(z.object({
        playerName: z.string(),
        count: z.number(),
        appearance: z.object({
            primaryColor: z.number(),
            foregroundEmblem: z.number(),
            backgroundEmblem: z.number(),
            emblemFlags: z.number(),
            emblemPrimaryColor: z.number(),
            emblemSecondaryColor: z.number(),
            emblemBackgroundColor: z.number(),
        }).optional(),
    })),
    mostKilledBy: z.array(z.object({
        playerName: z.string(),
        count: z.number(),
        appearance: z.object({
            primaryColor: z.number(),
            foregroundEmblem: z.number(),
            backgroundEmblem: z.number(),
            emblemFlags: z.number(),
            emblemPrimaryColor: z.number(),
            emblemSecondaryColor: z.number(),
            emblemBackgroundColor: z.number(),
        }).optional(),
    })),
    medalChest: z.record(z.string(), z.number()),
    weaponKills: z.array(z.object({
        killType: z.number(),
        count: z.number(),
    })),
    weaponOfChoice: z.object({
        killType: z.number(),
        count: z.number(),
    }).nullable(),
}));

export const playerStatistics = publicProcedure.input(
    z.object({ gamertag: z.string().min(1) })
).query(async (opts) => {
    const response = await sunrise2Axios.get(
        `/halo3/players/by-gamertag/${encodeURIComponent(opts.input.gamertag)}/statistics`
    );
    const parsed = PlayerStatisticsSchema.safeParse(response.data);
    if (!parsed.success) {
        throw new Error(`playerStatistics: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
});

