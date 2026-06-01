import { z } from "zod";
import { publicProcedure } from "../trpc";
import { reachAxios } from "./reachAxios";
import { jsonStringifySchema } from "@/src/zod";

const OnlinePlayersSchema = jsonStringifySchema(
  z.object({
    count: z.number(),
  }),
);

export const onlinePlayers = publicProcedure.query(async () => {
  const response = await reachAxios.get(`/haloreach/online-players`);
  const parsed = OnlinePlayersSchema.safeParse(response.data);
  if (!parsed.success) {
    throw new Error(
      `reach.onlinePlayers: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`,
    );
  }
  return parsed.data;
});
