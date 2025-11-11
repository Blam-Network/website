import { z } from "zod";
import { publicProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";
import { jsonStringifySchema } from "@/src/zod";

const OnlinePlayers24hSchema = jsonStringifySchema(z.object({
    count: z.number(),
}));

export const onlinePlayers24h = publicProcedure.query(async () => {
    const response = await sunrise2Axios.get(`/halo3/online-players-24h`);
    const parsed = OnlinePlayers24hSchema.safeParse(response.data);
    if (!parsed.success) {
        throw new Error(`onlinePlayers24h: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
});

