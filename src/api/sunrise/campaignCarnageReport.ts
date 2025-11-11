import { z } from "zod";
import { publicProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";
import { jsonStringifySchema } from "@/src/zod";

const CampaignPlayerKillSchema = z.object({
    player_xuid: z.string(),
    carnage_report_id: z.string(),
    enemy_type: z.string(),
    infantry: z.number(),
    leader: z.number(),
    hero: z.number(),
    specialist: z.number(),
    light_vehicle: z.number(),
    heavy_vehicle: z.number(),
    giant_vehicle: z.number(),
    standard_vehicle: z.number(),
});

const CampaignPlayerSchema = z.object({
    player_name: z.string(),
    player_xuid: z.string(),
    player_identifier: z.string(),
    service_tag: z.string(),
    primary_color: z.number(),
    secondary_color: z.number(),
    tertiary_color: z.number(),
    player_model_choice: z.number(),
    foreground_emblem: z.number(),
    background_emblem: z.number(),
    emblem_flags: z.number(),
    emblem_primary_color: z.number(),
    emblem_secondary_color: z.number(),
    emblem_background_color: z.number(),
    campaign_difficulty_completed: z.number(),
    player_final_score: z.number(),
    kills: z.array(CampaignPlayerKillSchema),
    kills_total: z.number(),
    deaths: z.number().default(0),
    assists: z.number().default(0),
    betrayals: z.number().default(0),
    suicides: z.number().default(0),
    grenade_sticky_kills: z.number(),
    headshot_kills: z.number(),
    assassination_kills: z.number(),
    splatter_kills: z.number(),
    multi_kills: z.number(),
    needler_supercombine_kills: z.number(),
    emp_kills: z.number(),
    ai_betrayal_count: z.number(),
    infantry_kills: z.number(),
    leader_kills: z.number(),
    hero_kills: z.number(),
    specialist_kills: z.number(),
    light_vehicle_kills: z.number(),
    heavy_vehicle_kills: z.number(),
    giant_vehicle_kills: z.number(),
    standard_vehicle_kills: z.number(),
    style_total_count: z.number(),
    transient_subtotal: z.number(),
    subtotal: z.number(),
    medal_points: z.number(),
    scripted_points: z.number(),
});

const CampaignCarnageReportSchema = jsonStringifySchema(z.object({
    id: z.string().uuid(),
    game_id: z.string(),
    map_id: z.number(),
    scenario_path: z.string(),
    start_time: z.string(),
    finish_time: z.string(),
    campaign_id: z.number(),
    campaign_difficulty: z.number(),
    campaign_insertion_point: z.number(),
    campaign_metagame_scoring: z.number(),
    campaign_metagame_enabled: z.boolean(),
    campaign_active_primary_skulls: z.number(),
    campaign_active_secondary_skulls: z.number(),
    time_bonus: z.number(),
    final_total_score: z.number(),
    players: z.array(CampaignPlayerSchema),
}));

export type CampaignCarnageReport = z.infer<typeof CampaignCarnageReportSchema>;

export const getCampaignCarnageReport = publicProcedure.input(
    z.object({ id: z.string().uuid() })
).query(async (opts) => {
    const response = await sunrise2Axios.get(`/halo3/campaign-carnage-reports/${opts.input.id}`);
    const parsed = CampaignCarnageReportSchema.safeParse(response.data);
    if (!parsed.success) {
        throw new Error(`campaignCarnageReport: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
});

