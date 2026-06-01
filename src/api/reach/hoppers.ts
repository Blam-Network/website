import { publicProcedure } from "../trpc";
import { reachAxios } from "./reachAxios";
import { ReachHoppersResponseSchema } from "./hoppersSchema";

function parseReachJsonBody(data: unknown): unknown {
  return typeof data === "string" ? JSON.parse(data) : data;
}

export const hoppers = publicProcedure.query(async () => {
  const response = await reachAxios.get(`/haloreach/hoppers`);
  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `reach.hoppers: HTTP ${response.status}. body=${String(response.data).slice(0, 500)}`,
    );
  }
  const parsed = ReachHoppersResponseSchema.safeParse(parseReachJsonBody(response.data));
  if (!parsed.success) {
    throw new Error(
      `reach.hoppers: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`,
    );
  }
  return parsed.data;
});
