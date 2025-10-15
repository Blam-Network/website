import { z } from "zod";
import { PlayerInteractionSchema, PlayerSchema } from "./players";
import { TeamSchema } from "./teams";
import { CarryEventSchema, KillEventSchema, ScoreEventSchema } from "./events";

export const GameVariantSchema = z.object({
    date: z.string().refine(date => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
    name: z.string(),
    author: z.string(),
    author_id: z.string(),
    file_type: z.number(),
    unique_id: z.string(),
    description: z.string(),
    game_engine: z.number(),
    size_in_bytes: z.coerce.number(),
    author_is_xuid_online: z.boolean(),
});

export const MatchmakingOptionsSchema = z.object({
    tau: z.number(),
    beta: z.number(),
    hopper_name: z.string(),
    xlast_index: z.number(),
    hopper_ranked: z.boolean(),
    draw_probability: z.number(),
    hopper_identifier: z.number(),
    hopper_team_based: z.boolean(),
    experience_base_increment: z.number(),
    experience_penalty_decrement: z.number(),
});

export const CarnageReportSchema = z.object({
    id: z.string().uuid(),
    players: z.array(PlayerSchema),
    teams: z.array(TeamSchema).nullable().transform((teams) => (teams === null ? [] : teams)),
    events: z.object({
        kill_events: z.array(KillEventSchema).nullable().transform((kills) => (kills === null ? [] : kills)),
        carry_events: z.array(CarryEventSchema).nullable().transform((element) => (element === null ? [] : element)),
        score_events: z.array(ScoreEventSchema).nullable().transform((element) => (element === null ? [] : element)),
    }),
    game_variant: GameVariantSchema,
    matchmaking_options: MatchmakingOptionsSchema.nullable().optional(),
    player_interactions: z.array(PlayerInteractionSchema).nullable().transform((element) => (element === null ? [] : element)),
    map_id: z.number(),
    game_id: z.coerce.number(),
    started: z.boolean(),
    finished: z.boolean(),
    team_game: z.boolean(),
    start_time: z.coerce.date(),
    finish_time: z.coerce.date(),
    migrated_solo: z.boolean(),
    scenario_path: z.string(),
    map_variant_unique_id: z.string(),
    game_variant_unique_id: z.string(),
    in_group_session: z.boolean(),
    in_squad_session: z.boolean(),
    map_variant_name: z.string(),
    migrated_to_group: z.boolean(),
    simulation_aborted: z.boolean(),
});

export type CarnageReport = z.infer<typeof CarnageReportSchema>;