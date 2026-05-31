import { z } from "zod";
import { publicProcedure } from "../trpc";
import { aresAxios } from "./aresAxios";
import { jsonStringifySchema } from "@/src/zod";

const ScreenshotSchema = z.object({
  id: z.string().uuid(),
  header: z.object({
    filename: z.string(),
    description: z.string().nullable(),
  }),
  author: z.string().nullable(),
  date: z.coerce.date(),
});

const ScreenshotsSchema = jsonStringifySchema(z.array(ScreenshotSchema));
export type Screenshot = z.infer<typeof ScreenshotSchema>;
export type Screenshots = z.infer<typeof ScreenshotsSchema>;
const ScreenshotsResponseSchema = jsonStringifySchema(z.object({
  data: z.array(ScreenshotSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
}));

export const playerScreenshots = publicProcedure.input(
  z.object({
    xuid: z.string().min(1).optional(),
    gamertag: z.string().min(1).optional(),
    pageSize: z.number().min(1).max(48).default(48).optional(),
  }),
).query(async ({ input }) => {
  if (!input.xuid && !input.gamertag) throw new Error("playerScreenshots: either xuid or gamertag is required");
  const pageSize = input.pageSize ?? 48;
  const params = new URLSearchParams();
  params.set("pageSize", String(pageSize));
  const url = input.xuid
    ? `/ares/players/${/^[0-9A-F]{16}$/i.test(input.xuid) ? BigInt(`0x${input.xuid}`).toString(10) : input.xuid}/screenshots?${params.toString()}`
    : `/ares/players/by-gamertag/${encodeURIComponent(input.gamertag!)}/screenshots?${params.toString()}`;
  const response = await aresAxios.get(url);
  const parsed = ScreenshotsSchema.safeParse(response.data);
  if (!parsed.success) throw new Error(`playerScreenshots: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
  return parsed.data;
});

export const screenshot = publicProcedure.input(
  z.object({ id: z.string().uuid() }),
).query(async (opts) => {
  const response = await aresAxios.get(`/ares/screenshots/${opts.input.id}`);
  const parsed = ScreenshotSchema.safeParse(response.data);
  if (!parsed.success) throw new Error(`screenshot: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
  return parsed.data;
});

export const screenshots = publicProcedure.input(
  z.object({
    page: z.number().min(1).default(1).optional(),
    pageSize: z.number().min(1).default(48).optional(),
    gamertag: z.string().optional(),
  }),
).query(async (opts) => {
  const page = opts.input.page ?? 1;
  const pageSize = opts.input.pageSize ?? 48;
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (opts.input.gamertag) params.set("gamertag", opts.input.gamertag);
  const response = await aresAxios.get(`/ares/screenshots?${params.toString()}`);
  const parsed = ScreenshotsResponseSchema.safeParse(response.data);
  if (!parsed.success) throw new Error(`screenshots: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
  return parsed.data;
});
