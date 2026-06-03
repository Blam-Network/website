import { z } from "zod";
import { publicProcedure } from "../trpc";
import { assertAxiosOk } from "../http/axiosError";
import { halo3Axios } from "./halo3Axios";

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
	type: z.enum(['multiplayer', 'campaign']).optional(),
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
export type GamesResponse = z.infer<typeof GamesResponseSchema>;

export const recentGames = publicProcedure
	.output(z.array(RecentGameSchema))
	.query(async () => {
		try {
			const response = await halo3Axios.get(`/halo3/games?page=1&pageSize=22`);
			assertAxiosOk(response);

			let data = response.data;
			if (typeof data === "string") {
				data = JSON.parse(data);
			}

			const parsed = GamesResponseSchema.safeParse(data);
			if (!parsed.success) {
				console.error(
					"[recentGames] Schema validation failed:",
					JSON.stringify(parsed.error.errors, null, 2),
				);
				return [];
			}

			return parsed.data.data.map((game) => RecentGameSchema.parse(game));
		} catch (err) {
			console.error("[recentGames] fetch failed:", err);
			return [];
		}
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
    
    const response = await halo3Axios.get(`/halo3/games?${params.toString()}`);
    assertAxiosOk(response);

    let data = response.data;
    if (typeof data === "string") {
        data = JSON.parse(data);
    }

    const parsed = GamesResponseSchema.safeParse(data);
    if (!parsed.success) {
        console.error("[games] Schema validation failed:", JSON.stringify(parsed.error.errors, null, 2));
        throw new Error(`games: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
});
