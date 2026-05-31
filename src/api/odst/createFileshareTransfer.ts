import { protectedProcedure } from "../trpc";
import { odstAxios } from "./odstAxios";
import { z } from "zod";
import { xuidToHex } from "@/src/utils/xuid";
import { assertAxiosOk } from "../http/axiosError";

export const createFileshareTransfer = protectedProcedure.input(z.object({ fileId: z.string().uuid() })).mutation(async (opts) => {
  const response = await odstAxios.post("/halo3odst/fileshare/transfer", JSON.stringify({ fileId: opts.input.fileId }), {
    headers: {
      "Content-Type": "application/json",
      "x-xuid": xuidToHex(opts.ctx.auth.user.xuid),
      "x-uhs": opts.ctx.auth.user.xboxUserHash,
      Authorization: opts.ctx.auth.tokens.xsts,
    },
  });
  assertAxiosOk(response);
});
