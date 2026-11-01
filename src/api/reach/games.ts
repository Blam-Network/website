import { z } from "zod";
import { publicProcedure } from "../trpc";
import { reachAxios } from "./reachAxios";
import { jsonStringifySchema } from "@/src/zod";

const ReachGameListItemSchema = z.object({
  id: z.string(),
  gui_game_mode: z.number(),
  game_engine: z.number(),
  team_game: z.boolean(),
  map_id: z.number(),
  map_variant_name: z.string(),
  game_variant_name: z.string(),
  game_variant_icon_index: z.number(),
  campaign_difficulty: z.number(),
  hopper_name: z.string().nullable(),
  start_time: z.string(),
  finish_time: z.string(),
  player_count: z.number(),
  player: z
    .object({
      player_name: z.string(),
      team: z.number(),
      standing: z.number(),
      score: z.number(),
      kills: z.number(),
      deaths: z.number(),
      assists: z.number(),
    })
    .nullable(),
});

export type ReachGameListItem = z.infer<typeof ReachGameListItemSchema>;

const ReachGamesResponseObjectSchema = z.object({
  data: z.array(ReachGameListItemSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

export type ReachGamesResponse = z.infer<typeof ReachGamesResponseObjectSchema>;

const ReachGamesResponseSchema = jsonStringifySchema(ReachGamesResponseObjectSchema);

const ReachGamePlayerSchema = z.object({
  player_index: z.number(),
  player_xuid: z.string(),
  player_name: z.string(),
  service_tag: z.string(),
  team: z.number(),
  standing: z.number(),
  score: z.number(),
  player_rating: z.number(),
  ticks_played: z.number(),
  grade: z.number(),
  sub_grade: z.number(),
  is_elite: z.boolean(),
  primary_color: z.number(),
  secondary_color: z.number(),
  tertiary_color: z.number(),
  foreground_emblem: z.number(),
  background_emblem: z.number(),
  emblem_flags: z.number(),
  emblem_primary_color: z.number(),
  emblem_secondary_color: z.number(),
  emblem_background_color: z.number(),
  kills: z.number(),
  deaths: z.number(),
  assists: z.number(),
  betrayals: z.number(),
  suicides: z.number(),
  most_kills_in_a_row: z.number(),
  seconds_alive: z.number(),
  statistics: z.array(z.number()),
  campaign_metagame_final_score: z.number(),
  medals: z.array(z.object({ medal: z.number(), count: z.number() })),
  weapons: z.array(
    z.object({
      damage_type: z.number(),
      kills: z.number(),
      deaths: z.number(),
      betrayals: z.number(),
      suicides: z.number(),
      headshots: z.number(),
    }),
  ),
  versus: z.array(z.object({ opponent_index: z.number(), kills: z.number(), deaths: z.number() })),
  ai_kills: z.array(
    z.object({ bucket_type: z.number(), bucket_class: z.number(), kills: z.number(), betrayals: z.number() }),
  ),
});

export type ReachGamePlayer = z.infer<typeof ReachGamePlayerSchema>;

const ReachGameObjectSchema = z.object({
    id: z.string(),
    gui_game_mode: z.number(),
    game_engine: z.number(),
    game_engine_category: z.number(),
    team_game: z.boolean(),
    start_time: z.string(),
    finish_time: z.string(),
    map_id: z.number(),
    map_variant_name: z.string(),
    game_variant_name: z.string(),
    game_variant_description: z.string(),
    game_variant_icon_index: z.number(),
    custom_statistic_names: z.array(z.string()),
    custom_statistic_formats: z.array(z.number()),
    campaign_difficulty: z.number(),
    score_to_win_round: z.number(),
    number_of_rounds: z.number(),
    hopper_name: z.string().nullable(),
    hopper_ranked: z.boolean().nullable(),
    survival_sets_completed: z.number(),
    survival_full_rounds_completed: z.number(),
    survival_waves_completed: z.number(),
    teams: z.array(
      z.object({ team_index: z.number(), standing: z.number(), score: z.number(), statistics: z.array(z.number()) }),
    ),
    players: z.array(ReachGamePlayerSchema),
  });

export type ReachGame = z.infer<typeof ReachGameObjectSchema>;

const ReachGameSchema = jsonStringifySchema(ReachGameObjectSchema);

export const reachGameModeSchema = z.enum(["campaign", "matchmaking", "custom", "forge", "firefight"]);

export const games = publicProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(25),
      gamertag: z.string().optional(),
      mode: reachGameModeSchema.optional(),
    }),
  )
  .query(async ({ input }) => {
    const params = new URLSearchParams();
    params.set("page", String(input.page));
    params.set("pageSize", String(input.pageSize));
    if (input.gamertag?.trim()) {
      params.set("gamertag", input.gamertag.trim());
    }
    if (input.mode) {
      params.set("mode", input.mode);
    }
    const response = await reachAxios.get(`/haloreach/games?${params.toString()}`);
    const parsed = ReachGamesResponseSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error(`reach.games: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data as ReachGamesResponse;
  });

export const game = publicProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ input }) => {
    const response = await reachAxios.get(`/haloreach/games/${input.id}`);
    if (response.status === 404) {
      return null;
    }
    const parsed = ReachGameSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error(`reach.game: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data as ReachGame;
  });
