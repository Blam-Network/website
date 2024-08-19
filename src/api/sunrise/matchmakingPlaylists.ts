import { z } from "zod";
import { publicProcedure } from "../trpc";
import { sunriseAxios } from "./sunriseRouter";

const PlaylistsSchema = z.preprocess((val) => typeof val === 'string' ? JSON.parse(val) : val, z.array(z.object({}).passthrough()));

export const matchmakingPlaylists = publicProcedure.query(async () => {
    const response = await sunriseAxios.get("/sunrise/online/playlists");
    const data = PlaylistsSchema.parse(response.data);
    return data;
});