import { z } from "zod";
import { StatisticsSchema } from "./statistics";

export const TeamSchema = z.object({
    team_index: z.number(),
    score: z.number(),
    standing: z.number().transform((standing) => standing + 1),
    statistics: StatisticsSchema,
});
