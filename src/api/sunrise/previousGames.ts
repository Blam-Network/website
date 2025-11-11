import { z } from "zod";
import { publicProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";
import { jsonStringifySchema } from "@/src/zod";

const PreviousGameSchema = z.preprocess((data: any) => {
	// If type is missing, default to 'multiplayer' for backward compatibility
	if (data && typeof data === 'object' && !('type' in data)) {
		return { ...data, type: 'multiplayer' };
	}
	return data;
}, z.object({
	id: z.string().uuid(),
	type: z.enum(['multiplayer', 'campaign']).default('multiplayer'),
	map_id: z.number(),
	game_id: z.string(),
	start_time: z.coerce.date(),
	finish_time: z.coerce.date(),
	team_game: z.boolean(),
	map_variant_name: z.string().nullish(),
	game_variant_unique_id: z.string().nullish(),
	game_variant_name: z.string().nullish(),
	hopper_name: z.string().nullish(),
	hopper_identifier: z.number().nullable(),
	campaign_difficulty: z.number().optional(),
	campaign_id: z.number().optional(),
}));

const PreviousGamesResponseSchema = jsonStringifySchema(z.object({
	data: z.array(PreviousGameSchema),
	total: z.number(),
	page: z.number(),
	pageSize: z.number(),
	totalPages: z.number(),
}));

const PreviousGamesArraySchema = jsonStringifySchema(z.array(PreviousGameSchema));

export type PreviousGame = z.infer<typeof PreviousGameSchema>;
export type PreviousGamesResponse = z.infer<typeof PreviousGamesResponseSchema>;

export const playerPreviousGames = publicProcedure.input(
	z.object({ 
		gamertag: z.string().min(1),
		page: z.number().min(1).default(1).optional(),
		pageSize: z.number().min(1).default(25).optional(),
	})
).query(async ({ input }) => {
	const page = input.page ?? 1;
	const pageSize = input.pageSize ?? 25;
	
	const url = `/halo3/players/by-gamertag/${encodeURIComponent(input.gamertag)}/carnage-reports?page=${page}&pageSize=${pageSize}`;
	const response = await sunrise2Axios.get(url);
	
	// Try to parse as paginated response first
	const paginatedParsed = PreviousGamesResponseSchema.safeParse(response.data);
	if (paginatedParsed.success) {
		return paginatedParsed.data;
	}
	
	// Log the validation error for debugging
	if (!paginatedParsed.success) {
		console.error('[previousGames] Paginated schema validation failed:', JSON.stringify(paginatedParsed.error.errors, null, 2));
	}
	
	// Fall back to array format (backward compatibility)
	const arrayParsed = PreviousGamesArraySchema.safeParse(response.data);
	if (arrayParsed.success) {
		const games = arrayParsed.data;
		return {
			data: games,
			total: games.length,
			page: 1,
			pageSize: games.length,
			totalPages: 1,
		};
	}
	
	// Log the array validation error for debugging
	if (!arrayParsed.success) {
		console.error('[previousGames] Array schema validation failed:', JSON.stringify(arrayParsed.error.errors, null, 2));
	}
	
	throw new Error(`previousGames: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
});


