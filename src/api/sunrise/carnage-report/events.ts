import { z } from "zod";

export const PositionSchema = z.array(z.number()).length(3);

export const KillEventSchema = z.object({
  time: z.number(),
  kill_type: z.number(),
  dead_position: PositionSchema,
  killer_position: PositionSchema,
  dead_player_index: z.number(),
  killer_player_index: z.number(),
});

export const CarryEventSchema = z.object({
    time: z.number(),
    position: PositionSchema,
    carry_type: z.number(),
    weapon_index: z.number(),
    carry_player_index: z.number(),
});

export const ScoreEventSchema = z.object({
    time: z.number(),
    position: PositionSchema,
    score_type: z.number(),
    weapon_index: z.number(),
    score_player_index: z.number(),
});