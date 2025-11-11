import { z } from "zod";
import { publicProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";
import { jsonStringifySchema } from "@/src/zod";

const RecentGameSchema = z.object({
	id: z.string().uuid(),
	map_id: z.number(),
	game_id: z.string(),
	start_time: z.coerce.date(),
	finish_time: z.coerce.date(),
	team_game: z.boolean(),
	map_variant_name: z.string(),
	game_variant_unique_id: z.string(),
	game_variant_name: z.string().nullish(),
	hopper_name: z.string().nullable(),
	hopper_identifier: z.number().nullable(),
	player_name: z.string().nullable(),
});

const GamesResponseSchema = jsonStringifySchema(z.object({
    data: z.array(RecentGameSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
}));

export type RecentGame = z.infer<typeof RecentGameSchema>;
export type GamesResponse = z.infer<typeof GamesResponseSchema>;

export const recentGames = publicProcedure.query(async () => {
	const response = await sunrise2Axios.get(`/halo3/games?page=1&pageSize=15`);
	const parsed = GamesResponseSchema.safeParse(response.data);
	if (!parsed.success) {
		throw new Error(`recentGames: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
	}
	return parsed.data.data;
});

export const games = publicProcedure.input(
    z.object({
        page: z.number().min(1).default(1).optional(),
        pageSize: z.number().min(1).default(48).optional(),
        gamertag: z.string().optional(),
    })
).query(async (opts) => {
    const page = opts.input.page ?? 1;
    const pageSize = opts.input.pageSize ?? 48;
    const gamertag = opts.input.gamertag;
    
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    if (gamertag) {
        params.set('gamertag', gamertag);
    }
    
    const response = await sunrise2Axios.get(`/halo3/games?${params.toString()}`);
    const parsed = GamesResponseSchema.safeParse(response.data);
    if (!parsed.success) {
        throw new Error(`games: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
});
