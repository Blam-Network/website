import { protectedProcedure } from "../trpc";
import { reachAxios } from "./reachAxios";
import { z } from "zod";
import { xuidToHex } from "@/src/utils/xuid";
import { assertAxiosOk } from "../http/axiosError";

export const reachCreateFileshareTransfer = protectedProcedure
  .input(z.object({ fileId: z.string().min(1) }))
  .mutation(async (opts) => {
    const response = await reachAxios.post(
      "/haloreach/fileshare/transfer",
      JSON.stringify({ fileId: opts.input.fileId }),
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
