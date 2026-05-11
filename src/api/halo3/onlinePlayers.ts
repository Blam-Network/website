import { z } from "zod";
import { publicProcedure } from "../trpc";
import { halo3Axios } from "./halo3Axios";
import { jsonStringifySchema } from "@/src/zod";

const OnlinePlayersSchema = jsonStringifySchema(z.object({
    count: z.number(),
}));

export const onlinePlayers = publicProcedure.query(async () => {
    const response = await halo3Axios.get(`/halo3/online-players`);
    const parsed = OnlinePlayersSchema.safeParse(response.data);
    if (!parsed.success) {
        throw new Error(`onlinePlayers: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
});

