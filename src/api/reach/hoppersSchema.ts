import { z } from "zod";
import { jsonStringifySchema } from "@/src/zod";

export const ReachHoppersResponseSchema = jsonStringifySchema(
  z.object({
    hoppers: z.record(z.string(), z.string()),
  }),
);

export type ReachHoppersResponse = z.infer<typeof ReachHoppersResponseSchema>;
