import { protectedAdminProcedure } from "../trpc";
import { reachAxios } from "./reachAxios";
import { ReachLobbiesResponseSchema } from "./lobbiesSchema";

function parseReachJsonBody(data: unknown): unknown {
  return typeof data === "string" ? JSON.parse(data) : data;
}

export const lobbies = protectedAdminProcedure.query(async () => {
  const response = await reachAxios.get(`/haloreach/lobbies`);
  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `reach.lobbies: HTTP ${response.status}. body=${String(response.data).slice(0, 500)}`,
    );
  }
  const parsed = ReachLobbiesResponseSchema.safeParse(parseReachJsonBody(response.data));
  if (!parsed.success) {
    throw new Error(
      `reach.lobbies: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`,
    );
  }
  return parsed.data;
});
