import { z } from "zod";
import { publicProcedure } from "../trpc";
import { aresAxios } from "./aresAxios";
import { jsonStringifySchema } from "@/src/zod";

const ActivityHeatmapSchema = jsonStringifySchema(z.object({
  data: z.record(z.string(), z.number()),
}));

export const activityHeatmap = publicProcedure.input(
  z.object({ gamertag: z.string().min(1) }),
).query(async (opts) => {
  const response = await aresAxios.get(`/ares/players/by-gamertag/${encodeURIComponent(opts.input.gamertag)}/activity-heatmap`);
  const parsed = ActivityHeatmapSchema.safeParse(response.data);
  if (!parsed.success) throw new Error(`activityHeatmap: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
  return parsed.data;
});
