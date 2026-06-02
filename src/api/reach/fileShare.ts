import { z } from "zod";
import { publicProcedure } from "../trpc";
import { reachAxios } from "./reachAxios";
import { jsonStringifySchema } from "@/src/zod";
import { ReachFileshareHeaderSchema } from "./fileshareFilesSchema";

const ReachFileShareSlotSchema = z.object({
  id: z.string(),
  uniqueId: z.string(),
  slotNumber: z.number(),
  header: ReachFileshareHeaderSchema,
});

const ReachFileShareSchema = jsonStringifySchema(
  z.object({
    id: z.string(),
    ownerId: z.string(),
    visibleSlots: z.number(),
    quotaBytes: z.number(),
    quotaSlots: z.number(),
    subscriptionHash: z.number(),
    slots: z.array(ReachFileShareSlotSchema),
  }),
);

export type ReachFileShareSlot = z.infer<typeof ReachFileShareSlotSchema>;
export type ReachFileShare = z.infer<typeof ReachFileShareSchema>;

export const fileShare = publicProcedure
  .input(z.object({ gamertag: z.string().min(1) }))
  .query(async ({ input }) => {
    const url = `/haloreach/players/by-gamertag/${encodeURIComponent(input.gamertag)}/fileshare`;
    const response = await reachAxios.get(url);
    const parsed = ReachFileShareSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error(
        `reach.fileShare: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`,
      );
    }
    return parsed.data;
  });
