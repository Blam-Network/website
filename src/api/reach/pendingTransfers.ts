import { protectedProcedure } from "../trpc";
import { reachAxios } from "./reachAxios";
import { xuidToHex } from "@/src/utils/xuid";
import { assertAxiosOk } from "../http/axiosError";
import {
  PendingTransfersResponseSchema,
  type PendingTransferItem,
  type PendingTransfersResponse,
} from "../fileshare/pendingTransferSchema";

export type ReachPendingTransfer = PendingTransferItem;
export type { PendingTransfersResponse as ReachPendingTransfersResponse };

export const reachPendingTransfers = protectedProcedure.query(async (opts) => {
  const response = await reachAxios.get("/haloreach/fileshare/transfers", {
    headers: {
      "x-xuid": xuidToHex(opts.ctx.auth.user.xuid),
      "x-uhs": opts.ctx.auth.user.xboxUserHash,
      Authorization: opts.ctx.auth.tokens.xsts,
    },
  });
  assertAxiosOk(response);

  let data = response.data;
  if (typeof data === "string") {
    data = JSON.parse(data);
  }
  const parsed = PendingTransfersResponseSchema.safeParse(data);
  if (!parsed.success) {
    console.error(
      "[reachPendingTransfers] Schema validation failed:",
      JSON.stringify(parsed.error.errors, null, 2),
    );
    throw new Error(`reachPendingTransfers: schema mismatch. got=${JSON.stringify(data).slice(0, 500)}`);
  }
  return parsed.data;
});
