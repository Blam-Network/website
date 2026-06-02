import { z } from "zod";
import { jsonStringifySchema } from "@/src/zod";

export const ReachScreenshotSchema = z.object({
  id: z.string().uuid(),
  header: z.object({
    filename: z.string(),
    description: z.string().nullable(),
  }),
  author: z.string().nullable(),
  date: z.coerce.date(),
});

export const ScreenshotsResponseSchema = jsonStringifySchema(
  z.object({
    data: z.array(ReachScreenshotSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  }),
);

export type Screenshot = z.infer<typeof ReachScreenshotSchema>;

export const ReachScreenshotResponseSchema = jsonStringifySchema(ReachScreenshotSchema);
