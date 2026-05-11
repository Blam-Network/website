import { z } from "zod";
import { publicProcedure } from "../trpc";
import { aresAxios } from "./aresAxios";
import { jsonStringifySchema } from "@/src/zod";

const ServiceRecordSchema = jsonStringifySchema(z.object({
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
  spartanHelmet: z.number(),
  spartanLeftShounder: z.number(),
  spartanRightShoulder: z.number(),
  spartanBody: z.number(),
  eliteHelmet: z.number(),
  eliteLeftShoulder: z.number(),
  eliteRightShoulder: z.number(),
  eliteBody: z.number(),
  serviceTag: z.string(),
  campaignProgress: z.number(),
  highestSkill: z.number(),
  totalEXP: z.number(),
  unknownInsignia: z.number(),
  rank: z.number(),
  grade: z.number(),
  unknownInsignia2: z.number(),
  firstPlayed: z.coerce.date().optional(),
  lastPlayed: z.coerce.date().optional(),
  gamesCompleted: z.number().optional(),
}));

export type ServiceRecord = z.infer<typeof ServiceRecordSchema>;

export const serviceRecord = publicProcedure.input(
  z.object({ xuid: z.string().min(1).optional(), gamertag: z.string().min(1).optional() }),
).query(async ({ input }) => {
  if (!input.xuid && !input.gamertag) throw new Error("serviceRecord: either xuid or gamertag is required");
  const url = input.xuid
    ? `/ares/players/${/^[0-9A-F]{16}$/i.test(input.xuid) ? BigInt(`0x${input.xuid}`).toString(10) : input.xuid}/servicerecord`
    : `/ares/players/by-gamertag/${encodeURIComponent(input.gamertag!)}/servicerecord`;
  const response = await aresAxios.get(url);
  const parsed = ServiceRecordSchema.safeParse(response.data);
  if (!parsed.success) throw new Error(`serviceRecord: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
  return parsed.data;
});

const ServiceRecordsResponseSchema = jsonStringifySchema(z.object({
  players: z.array(ServiceRecordSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
}));

export const serviceRecords = publicProcedure.input(
  z.object({ pageSize: z.number().optional().default(20), page: z.number().optional().default(1), search: z.string().optional() }),
).query(async ({ input }) => {
  const params = new URLSearchParams();
  params.append("page", String(input.page || 1));
  params.append("pageSize", String(input.pageSize || 20));
  if (input.search) params.append("search", input.search);
  const response = await aresAxios.get(`/ares/players?${params.toString()}`);
  const parsed = ServiceRecordsResponseSchema.safeParse(response.data);
  if (!parsed.success) throw new Error(`serviceRecords: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
  return parsed.data;
});
