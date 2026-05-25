import { z } from "zod";
import { publicProcedure } from "../trpc";
import { odstAxios } from "./odstAxios";
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
const ScreenshotsResponseSchema = jsonStringifySchema(
  z.object({
    data: z.array(ScreenshotSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  }),
);

export type ScreenshotsResponse = z.infer<typeof ScreenshotsResponseSchema>;

export const playerScreenshots = publicProcedure
  .input(z.object({ xuid: z.string().min(1).optional(), gamertag: z.string().min(1).optional() }))
  .query(async ({ input }) => {
    if (!input.xuid && !input.gamertag) throw new Error("playerScreenshots: either xuid or gamertag is required");
    const url = input.xuid
      ? `/halo3odst/players/${/^[0-9A-F]{16}$/i.test(input.xuid) ? BigInt(`0x${input.xuid}`).toString(10) : input.xuid}/screenshots`
      : `/halo3odst/players/by-gamertag/${encodeURIComponent(input.gamertag!)}/screenshots`;
    const response = await odstAxios.get(url);
    const parsed = ScreenshotsSchema.safeParse(response.data);
    if (!parsed.success) throw new Error(`playerScreenshots: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    return parsed.data;
  });

export const screenshot = publicProcedure.input(z.object({ id: z.string().uuid() })).query(async (opts) => {
  const response = await odstAxios.get(`/halo3odst/screenshots/${opts.input.id}`);
  const parsed = ScreenshotSchema.safeParse(response.data);
  if (!parsed.success) throw new Error(`screenshot: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
  return parsed.data;
});

export const screenshots = publicProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1).optional(),
      pageSize: z.number().min(1).default(48).optional(),
      gamertag: z.string().optional(),
    }),
  )
  .query(async (opts) => {
    const page = opts.input.page ?? 1;
    const pageSize = opts.input.pageSize ?? 48;
    const gamertag = opts.input.gamertag;

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    if (gamertag) {
      params.set("gamertag", gamertag);
    }

    const response = await odstAxios.get(`/halo3odst/screenshots?${params.toString()}`);
    const parsed = ScreenshotsResponseSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error(`screenshots: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
  });
