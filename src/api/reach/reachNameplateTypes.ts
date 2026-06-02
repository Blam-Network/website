import { z } from "zod";

export const ReachNameplateIdSchema = z.enum([
  "ar",
  "bungie",
  "column",
  "dmr",
  "marathon",
  "halo1",
  "halo2",
  "halo3",
  "odst",
  "helmet",
  "halo",
  "star",
]);

export type ReachNameplateId = z.infer<typeof ReachNameplateIdSchema>;

export type ReachNameplateEquipId = ReachNameplateId | "none";

const ReachNameplateUnlocksSchema = z.object({
  ar: z.boolean(),
  bungie: z.boolean(),
  column: z.boolean(),
  dmr: z.boolean(),
  marathon: z.boolean(),
  halo1: z.boolean(),
  halo2: z.boolean(),
  halo3: z.boolean(),
  odst: z.boolean(),
  helmet: z.boolean(),
  halo: z.boolean(),
  star: z.boolean(),
});

export const ReachNameplatesResponseSchema = z.object({
  selectedNameplate: z.union([ReachNameplateIdSchema, z.literal("none")]),
  unlocks: ReachNameplateUnlocksSchema,
});

export type ReachNameplatesResponse = z.infer<typeof ReachNameplatesResponseSchema>;
