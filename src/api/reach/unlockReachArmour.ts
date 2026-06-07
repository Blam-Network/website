import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { reachAxios } from "./reachAxios";
import { xuidToHex } from "@/src/utils/xuid";
import { assertAxiosOk } from "../http/axiosError";
import {
  ReachArmourUnlocksResponseSchema,
  ReachUnlockableHelmetIdSchema,
} from "./reachArmourUnlockTypes";

export const unlockReachArmour = protectedProcedure
  .input(
    z.object({
      helmetId: ReachUnlockableHelmetIdSchema,
    }),
  )
  .mutation(async (opts) => {
    const response = await reachAxios.post(
      "/haloreach/players/armour-unlocks",
      JSON.stringify({ helmetId: opts.input.helmetId }),
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

    let data: unknown = response.data;
    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    const parsed = ReachArmourUnlocksResponseSchema.extend({
      ok: z.literal(true),
    }).safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `reach.unlockReachArmour: schema mismatch. got=${JSON.stringify(data).slice(0, 500)}`,
      );
    }

    return parsed.data;
  });
