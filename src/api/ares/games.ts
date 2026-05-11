import { z } from "zod";
import { publicProcedure } from "../trpc";
import { aresAxios } from "./aresAxios";

const RecentGameSchema = z.object({
  id: z.string().uuid(),
  map_id: z.number(),
  game_id: z.string(),
  start_time: z.coerce.date(),
  finish_time: z.coerce.date(),
  team_game: z.boolean(),
  map_variant_name: z.string().nullable(),
  game_variant_unique_id: z.string().nullable(),
  game_variant_name: z.string().nullish(),
  game_engine: z.number().nullable().optional(),
  hopper_name: z.string().nullable(),
  hopper_identifier: z.number().nullable(),
  player_name: z.string().nullable(),
  type: z.enum(["multiplayer", "campaign"]).optional(),
  campaign_difficulty: z.number().optional(),
});

const GamesResponseSchema = z.object({
  data: z.array(RecentGameSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

export type RecentGame = z.infer<typeof RecentGameSchema>;

export const games = publicProcedure.input(
  z.object({
    page: z.number().min(1).default(1).optional(),
    pageSize: z.number().min(1).default(48).optional(),
    gamertag: z.string().optional(),
  }),
).query(async (opts) => {
  const params = new URLSearchParams();
  params.set("page", String(opts.input.page ?? 1));
  params.set("pageSize", String(opts.input.pageSize ?? 48));
  if (opts.input.gamertag) params.set("gamertag", opts.input.gamertag);
  const response = await aresAxios.get(`/ares/games?${params.toString()}`);
  const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
  const parsed = GamesResponseSchema.safeParse(data);
  if (!parsed.success) throw new Error(`games: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
  return parsed.data;
});
