import { z } from "zod";
import { publicProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";
import { jsonStringifySchema } from "@/src/zod";

const RecentScreenshotSchema = z.object({
	id: z.string().uuid(),
	header: z.object({
		filename: z.string(),
		description: z.string(),
	}),
	author: z.string(),
	date: z.coerce.date(),
});

const RecentScreenshotsSchema = jsonStringifySchema(z.array(RecentScreenshotSchema));

export type RecentScreenshot = z.infer<typeof RecentScreenshotSchema>;

export const recentScreenshots = publicProcedure.query(async () => {
	const response = await sunrise2Axios.get(`/halo3/recent-screenshots`);
	const parsed = RecentScreenshotsSchema.safeParse(response.data);
	if (!parsed.success) {
		throw new Error(`recentScreenshots: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
	}
	return parsed.data;
});

