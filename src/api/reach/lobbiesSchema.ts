import { z } from "zod";
import { jsonStringifySchema } from "@/src/zod";

const ReachLobbyPlayerAppearanceSchema = z.object({
  primaryColor: z.number(),
  foregroundEmblem: z.number(),
  backgroundEmblem: z.number(),
  emblemFlags: z.number(),
  emblemPrimaryColor: z.number(),
  emblemSecondaryColor: z.number(),
  emblemBackgroundColor: z.number(),
  model: z.number(),
  serviceTag: z.string(),
});

const ReachLobbyPlayerRankSchema = z.object({
  grade: z.number(),
  subGrade: z.number(),
});

const ReachLobbyPlayerSchema = z.object({
  xuid: z.string(),
  team: z.number().nullable(),
  playerName: z.string().nullable(),
  appearance: ReachLobbyPlayerAppearanceSchema.nullable(),
  rank: ReachLobbyPlayerRankSchema.nullable(),
});

const ReachLobbySchema = z.object({
  sessionId: z.string().nullable(),
  guiGameMode: z.number().nullable(),
  sessionGameMode: z.number().nullable(),
  hopperId: z.number().nullable(),
  hopperName: z.string().nullable(),
  sessionPrivacy: z.number().nullable(),
  sessionClosed: z.number().nullable(),
  players: z.array(ReachLobbyPlayerSchema),
});

export const ReachLobbiesResponseSchema = jsonStringifySchema(
  z.object({
    totalPlayers: z.number(),
    lobbies: z.array(ReachLobbySchema),
  }),
);

export type ReachLobby = z.infer<typeof ReachLobbySchema>;
export type ReachLobbyPlayer = z.infer<typeof ReachLobbyPlayerSchema>;
export type ReachLobbyPlayerAppearance = z.infer<
  typeof ReachLobbyPlayerAppearanceSchema
>;
