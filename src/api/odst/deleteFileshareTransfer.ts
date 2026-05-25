import { protectedProcedure } from "../trpc";
import { odstAxios } from "./odstAxios";
import { z } from "zod";
import { xuidToHex } from "@/src/utils/xuid";

export const deleteFileshareTransfer = protectedProcedure.input(z.object({ fileId: z.string().uuid() })).mutation(async (opts) => {
  const url = `/halo3odst/fileshare/transfers/${opts.input.fileId}`;
  const response = await odstAxios.delete(url, {
    headers: {
      "x-xuid": xuidToHex(opts.ctx.auth.user.xuid),
      "x-uhs": opts.ctx.auth.user.xboxUserHash,
      Authorization: opts.ctx.auth.tokens.xsts,
    },
  });
  if (response.status && response.status >= 400) {
    throw new Error(`Failed to delete transfer: ${response.status} ${response.statusText || ""}`);
  }
  return { success: true };
});
