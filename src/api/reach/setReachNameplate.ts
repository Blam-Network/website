import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { reachAxios } from "./reachAxios";
import { xuidToHex } from "@/src/utils/xuid";
import { assertAxiosOk } from "../http/axiosError";
import { ReachNameplateIdSchema } from "./reachNameplateTypes";

export const setReachNameplate = protectedProcedure
  .input(
    z.object({
      nameplateId: z.union([ReachNameplateIdSchema, z.literal("none")]),
    }),
  )
  .mutation(async (opts) => {
    const response = await reachAxios.post(
      "/haloreach/players/nameplates",
      JSON.stringify({ nameplateId: opts.input.nameplateId }),
      {
        headers: {
          "Content-Type": "application/json",
          "x-xuid": xuidToHex(opts.ctx.auth.user.xuid),
          "x-uhs": opts.ctx.auth.user.xboxUserHash,
          Authorization: opts.ctx.auth.tokens.xsts,
        },
      },
    );
    assertAxiosOk(response);
  });
