import { z } from "zod";
import { publicProcedure } from "../trpc";
import { assertAxiosOk } from "../http/axiosError";
import { reachAxios } from "./reachAxios";
import { jsonStringifySchema } from "@/src/zod";

const ReachServiceRecordSchema = jsonStringifySchema(z.object({
  id: z.string(),
  playerName: z.string(),
  appearanceFlags: z.number(),
  primaryColor: z.number(),
  secondaryColor: z.number(),
  tertiaryColor: z.number(),
  model: z.number(),
  foregroundEmblem: z.number(),
  backgroundEmblem: z.number(),
  emblemFlags: z.number(),
  emblemPrimaryColor: z.number(),
  emblemSecondaryColor: z.number(),
  emblemBackgroundColor: z.number(),
  serviceTag: z.string(),
  campaignProgress: z.number(),
  supplyDepotPct: z.number(),
  commendationUnlockPct: z.number(),
  grade: z.number(),
  subGrade: z.number(),
  cheatFlags: z.string(),
  banFlags: z.string(),
  matchmadeGamesPlayed: z.number(),
  modelPermutations: z.array(z.number()),
  nonModelCustomization: z.array(z.number()),
  highestSkill: z.number(),
  totalEXP: z.number(),
  rank: z.number(),
  unknownInsignia: z.number(),
  unknownInsignia2: z.number(),
  firstPlayed: z.coerce.date().nullable().optional(),
  lastPlayed: z.coerce.date().nullable().optional(),
  gamesCompleted: z.number().optional(),
}));

export type ReachServiceRecord = z.infer<typeof ReachServiceRecordSchema>;

export const serviceRecord = publicProcedure
  .input(
    z.object({
      xuid: z.string().min(1).optional(),
      gamertag: z.string().min(1).optional(),
    }),
  )
  .query(async ({ input }) => {
    if (!input.xuid && !input.gamertag) {
      throw new Error("reach.serviceRecord: either xuid or gamertag is required");
    }

    const url = input.xuid
      ? `/haloreach/players/${/^[0-9A-F]{16}$/i.test(input.xuid) ? BigInt(`0x${input.xuid}`).toString(10) : input.xuid}/servicerecord`
      : `/haloreach/players/by-gamertag/${encodeURIComponent(input.gamertag!)}/servicerecord`;

    const response = await reachAxios.get(url);
    const parsed = ReachServiceRecordSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error(`reach.serviceRecord: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }

    return parsed.data;
  });

const ReachServiceRecordsResponseSchema = jsonStringifySchema(
  z.object({
    players: z.array(ReachServiceRecordSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  }),
);

export const serviceRecords = publicProcedure
  .input(
    z.object({
      pageSize: z.number().optional().default(20),
      page: z.number().optional().default(1),
      search: z.string().optional(),
    }),
  )
  .query(async ({ input }) => {
    const params = new URLSearchParams();
    params.append("page", String(input.page || 1));
    params.append("pageSize", String(input.pageSize || 20));
    if (input.search) {
      params.append("search", input.search);
    }

    const response = await reachAxios.get(`/haloreach/players?${params.toString()}`);
    assertAxiosOk(response);
    const parsed = ReachServiceRecordsResponseSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error(
        `reach.serviceRecords: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`,
      );
    }
    return parsed.data;
  });
