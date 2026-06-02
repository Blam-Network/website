import { protectedProcedure } from "../trpc";
import { reachAxios } from "./reachAxios";
import { xuidToHex } from "@/src/utils/xuid";
import { assertAxiosOk } from "../http/axiosError";
import { ReachNameplatesResponseSchema } from "./reachNameplateTypes";

export const getNameplates = protectedProcedure.query(async (opts) => {
  const response = await reachAxios.get("/haloreach/players/nameplates", {
    headers: {
      "x-xuid": xuidToHex(opts.ctx.auth.user.xuid),
      "x-uhs": opts.ctx.auth.user.xboxUserHash,
      Authorization: opts.ctx.auth.tokens.xsts,
    },
  });
  assertAxiosOk(response);

  let data: unknown = response.data;
  if (typeof data === "string") {
    data = JSON.parse(data);
  }

  const parsed = ReachNameplatesResponseSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `reach.getNameplates: schema mismatch. got=${JSON.stringify(data).slice(0, 500)}`,
    );
  }

  return parsed.data;
});
