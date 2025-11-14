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
        count: z.coerce.number(),
        player_xuid: z.string(),
        player_name: z.string(),
        service_tag: z.string().optional(),
        is_elite: z.number().optional(),
        primary_color: z.number(),
        foreground_emblem: z.number(),
        background_emblem: z.number(),
        emblem_flags: z.number(),
        emblem_primary_color: z.number(),
        emblem_secondary_color: z.number(),
        emblem_background_color: z.number(),
    })),
    mostKilledBy: z.array(z.object({
        count: z.coerce.number(),
        player_xuid: z.string(),
        player_name: z.string(),
        service_tag: z.string().optional(),
        is_elite: z.number().optional(),
        primary_color: z.number(),
        foreground_emblem: z.number(),
        background_emblem: z.number(),
        emblem_flags: z.number(),
        emblem_primary_color: z.number(),
        emblem_secondary_color: z.number(),
        emblem_background_color: z.number(),
    })),
    medalChest: z.array(z.object({
        medal: z.string(),
        count: z.number(),
    })),
    weaponKills: z.array(z.object({
        weapon: z.string(),
        kills: z.number(),
    })),
    weaponOfChoice: z.object({
        weapon: z.string(),
        kills: z.number(),
    }).nullable(),
    steaktacularCount: z.number().optional(),
    linktacularCount: z.number().optional(),
}));

export const playerStatistics = publicProcedure.input(
    z.object({ gamertag: z.string().min(1) })
).query(async (opts) => {
    try {
        const response = await sunrise2Axios.get(
            `/halo3/players/by-gamertag/${encodeURIComponent(opts.input.gamertag)}/statistics`
        );
        
        // Check response status code
        if (response.status >= 400) {
            const errorMessage = response.data?.message || `HTTP ${response.status}: ${response.statusText || 'Unknown error'}`;
            throw new Error(`Backend error: ${errorMessage}`);
        }
        
        // Check if the response is an error object (even with 200 status)
        if (response.data && typeof response.data === 'object' && 'statusCode' in response.data && 'message' in response.data) {
            throw new Error(`Backend error: ${response.data.message || 'Internal server error'}`);
        }
        
        const parsed = PlayerStatisticsSchema.safeParse(response.data);
        if (!parsed.success) {
            console.error('Schema validation error:', parsed.error);
            console.error('Response data:', JSON.stringify(response.data, null, 2));
            throw new Error(`playerStatistics: schema mismatch. got=${JSON.stringify(response.data).slice(0, 1000)}. Errors: ${JSON.stringify(parsed.error.errors)}`);
        }
        return parsed.data;
    } catch (error: any) {
        // If it's already our error, re-throw it
        if (error.message && (error.message.startsWith('Backend error:') || error.message.startsWith('playerStatistics:'))) {
            throw error;
        }
        // Otherwise, it's likely an axios error
        if (error.response) {
            const errorMessage = error.response.data?.message || error.response.statusText || `HTTP ${error.response.status}: Unknown error`;
            throw new Error(`Backend error: ${errorMessage}`);
        }
        throw error;
    }
});

