import { z } from "zod";
import { assertAxiosOk } from "../http/axiosError";
import { halo3Axios } from "../halo3/halo3Axios";
import { publicProcedure } from "../trpc";
import { FileshareSourceGameResponseSchema } from "./fileshareSourceGameSchema";

export const fileshareSourceGame = publicProcedure
  .input(
    z.object({
      game: z.enum(["halo3", "odst", "reach"]),
      fileId: z.string().min(1),
    }),
  )
  .query(async ({ input }) => {
    if (input.game !== "halo3") {
      return { sourceGame: null };
    }

    const response = await halo3Axios.get(
      `/halo3/fileshare/files/${encodeURIComponent(input.fileId)}/source-game`,
    );

    assertAxiosOk(response);

    const parsed = FileshareSourceGameResponseSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error(
        `fileshareSourceGame: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`,
      );
    }

    return parsed.data;
  });
