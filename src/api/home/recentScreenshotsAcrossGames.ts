import { z } from "zod";
import { publicProcedure } from "../trpc";
import { halo3Axios } from "../halo3/halo3Axios";
import { jsonStringifySchema } from "@/src/zod";

export const HomeRecentScreenshotSchema = z.object({
  id: z.string().uuid(),
  game: z.enum(["halo3", "odst", "reach"]),
  header: z.object({
    filename: z.string(),
    description: z.string().nullable().optional(),
  }),
  author: z.string().nullable().optional(),
  date: z.coerce.date(),
});

const RecentScreenshotsAcrossGamesSchema = jsonStringifySchema(z.array(HomeRecentScreenshotSchema));

export type HomeRecentScreenshot = z.infer<typeof HomeRecentScreenshotSchema>;

export const recentScreenshotsAcrossGames = publicProcedure.query(async (): Promise<HomeRecentScreenshot[]> => {
  const response = await halo3Axios.get("/network/recent-screenshots");
  const parsed = RecentScreenshotsAcrossGamesSchema.safeParse(response.data);
  if (!parsed.success) {
    throw new Error(
      `recentScreenshotsAcrossGames: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`,
    );
  }
  return parsed.data.map((item: HomeRecentScreenshot) => ({
    ...item,
    header: {
      filename: item.header.filename,
      description: item.header.description ?? "",
    },
    author: item.author ?? undefined,
  }));
});
