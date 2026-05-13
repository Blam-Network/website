import { protectedProcedure } from "../trpc";
import { reachAxios } from "./reachAxios";
import { z } from "zod";
import { xuidToHex } from "@/src/utils/xuid";

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
    if (response.status && response.status >= 400) {
      const body =
        typeof response.data === "string" ? response.data : JSON.stringify(response.data ?? "");
      throw new Error(`reachCreateFileshareTransfer: ${response.status} ${body.slice(0, 200)}`);
    }
  });
