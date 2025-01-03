import { z } from "zod";
import { publicProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";

const CarnageReportPlayerSchema = z.object({
    player_name: z.string(),
    highest_skill: z.number(),
    rank: z.number(),
    grade: z.number(),
    place: z.number(),
    score: z.number(),
    primary_color: z.number(),
    secondary_color: z.number(),
    tertiary_color: z.number(),
    emblem_primary_color: z.number(),
    emblem_secondary_color: z.number(),
    emblem_background_color: z.number(),
    foreground_emblem: z.number(),
    background_emblem: z.number(),
    service_tag: z.string(),
    player_team: z.number(),
    games_played: z.number(),
    games_completed: z.number(),
    games_won: z.number(),
    games_tied: z.number(),
    rounds_completed: z.number(),
    rounds_won: z.number(),
    in_round_score: z.number(),
    in_game_total_score: z.number(),
    kills: z.number(),
    assists: z.number(),
    deaths: z.number(),
    betrayals: z.number(),
    suicides: z.number(),
    most_kills_in_a_row: z.number(),
    seconds_alive: z.number(),
    ctf_flag_scores: z.number(),
    ctf_flag_grabs: z.number(),
    ctf_flag_carrier_kills: z.number(),
    ctf_flag_returns: z.number(),
    assault_bomb_arms: z.number(),
    assault_bomb_grabs: z.number(),
    assault_bomb_disarms: z.number(),
    assault_bomb_detonations: z.number(),
    oddball_time_with_ball: z.number(),
    oddball_unused: z.number(),
    oddball_kills_as_carrier: z.number(),
    oddball_ball_carrier_kills: z.number(),
    king_time_on_hill: z.number(),
    king_total_control_time: z.number(),
    king_unused0: z.number(),
    king_unused1: z.number(),
    unused0: z.number(),
    unused1: z.number(),
    unused2: z.number(),
    vip_takedowns: z.number(),
    vip_kills_as_vip: z.number(),
    vip_guard_time: z.number(),
    vip_time_as_vip: z.number(),
    vip_lives_as_vip: z.number(),
    juggernaut_kills: z.number(),
    juggernaut_kills_as_juggernaut: z.number(),
    juggernaut_total_control_time: z.number(),
    total_wp: z.number(),
    juggernaut_unused: z.number(),
    territories_owned: z.number(),
    territories_captures: z.number(),
    territories_ousts: z.number(),
    territories_time_in_territory: z.number(),
    infection_zombie_kills: z.number(),
    infection_infections: z.number(),
    infection_time_as_human: z.number(),
  });

const CarnageReportTeamschema = z.object({
    team_index: z.number(),
    place: z.number(),
    score: z.number(),
});
  
const CarnageReportKill = z.object({
    killer: z.string(),
    killed: z.string(),
    kill_type: z.number(),
    time: z.coerce.number(),
});

const CarnageReportSchema = z.object({
    team_game: z.boolean(),
    start_time: z.string(), // ISO 8601 format validation
    finish_time: z.string(),
    game_variant_name: z.string().nullable(),
    map_variant_name: z.string().nullable(),
    map_id: z.number(),
    hopper_name: z.string().nullable(),
    game_engine: z.number(),
    file_type: z.number(),
    duration: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Must be in HH:MM:SS format"),
    players: z.array(CarnageReportPlayerSchema),
    kills: z.array(CarnageReportKill),
    teams: z.array(CarnageReportTeamschema),
});



export const getCarnageReport = publicProcedure.input(
    z.object({ id: z.string().uuid() })
).query(async (opts) => {
    const response = await sunrise2Axios.get(`/blamnet/stats/halo3/carnage-reports/${opts.input.id}`);
    console.log({headers: response.headers});
    console.log({response: response.data});
    const data = CarnageReportSchema.parse(JSON.parse(response.data));
    return data;
});