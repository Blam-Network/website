import { z } from "zod";

export const ReachUnlockableHelmetIdSchema = z.enum([
  "militarypolice_base",
  "militarypolice_cbrnhurs",
  "militarypolice_hurscnm",
  "cqb_base",
  "cqb_hurscnm",
  "cqb_uahul",
  "chest_uabasesecurity",
]);

export type ReachUnlockableHelmetId = z.infer<typeof ReachUnlockableHelmetIdSchema>;

const ReachArmourUnlocksSchema = z.object({
  militarypolice_base: z.boolean(),
  militarypolice_cbrnhurs: z.boolean(),
  militarypolice_hurscnm: z.boolean(),
  cqb_base: z.boolean(),
  cqb_hurscnm: z.boolean(),
  cqb_uahul: z.boolean(),
  chest_uabasesecurity: z.boolean(),
});

export const ReachArmourUnlocksResponseSchema = z.object({
  eligible: ReachArmourUnlocksSchema,
  unlocked: ReachArmourUnlocksSchema,
});

export type ReachArmourUnlocksResponse = z.infer<typeof ReachArmourUnlocksResponseSchema>;
