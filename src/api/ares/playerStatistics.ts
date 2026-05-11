import { z } from "zod";
import { publicProcedure } from "../trpc";
import { aresAxios } from "./aresAxios";
import { jsonStringifySchema } from "@/src/zod";

const PlayerStatisticsSchema = jsonStringifySchema(z.object({
  gameTypes: z.array(z.object({ name: z.string(), value: z.number() })),
  killsDeaths: z.array(z.object({ name: z.string(), value: z.number() })),
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
  medalChest: z.array(z.object({ medal: z.string(), count: z.number() })),
  weaponKills: z.array(z.object({ weapon: z.string(), kills: z.number() })),
  weaponOfChoice: z.object({ weapon: z.string(), kills: z.number() }).nullable(),
  steaktacularCount: z.number().optional(),
  linktacularCount: z.number().optional(),
}));

export const playerStatistics = publicProcedure.input(
  z.object({ gamertag: z.string().min(1) }),
).query(async (opts) => {
  const response = await aresAxios.get(`/ares/players/by-gamertag/${encodeURIComponent(opts.input.gamertag)}/statistics`);
  if (response.status >= 400) throw new Error(`Backend error: ${response.data?.message || response.statusText || `HTTP ${response.status}`}`);
  if (response.data && typeof response.data === "object" && "statusCode" in response.data && "message" in response.data) {
    throw new Error(`Backend error: ${response.data.message || "Internal server error"}`);
  }
  const parsed = PlayerStatisticsSchema.safeParse(response.data);
  if (!parsed.success) throw new Error(`playerStatistics: schema mismatch. got=${JSON.stringify(response.data).slice(0, 1000)}. Errors: ${JSON.stringify(parsed.error.errors)}`);
  return parsed.data;
});
