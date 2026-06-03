import { z } from "zod";
import { publicProcedure } from "../trpc";
import { assertAxiosOk } from "../http/axiosError";
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
  try {
    const response = await halo3Axios.get("/network/recent-screenshots");
    assertAxiosOk(response);

    const parsed = RecentScreenshotsAcrossGamesSchema.safeParse(response.data);
    if (!parsed.success) {
      console.error(
        "[recentScreenshotsAcrossGames] schema validation failed:",
        JSON.stringify(parsed.error.errors, null, 2),
      );
      return [];
    }

    return parsed.data.map((item: HomeRecentScreenshot) => ({
      ...item,
      header: {
        filename: item.header.filename,
        description: item.header.description ?? "",
      },
      author: item.author ?? undefined,
    }));
  } catch (err) {
    console.error("[recentScreenshotsAcrossGames] fetch failed:", err);
    return [];
  }
});
