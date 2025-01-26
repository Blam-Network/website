import { getToken, JWT } from "next-auth/jwt";
import { z } from "zod";

const JWTSchema = z.object({
    user: z.object({
        xuid: z.string(),
        gamertag: z.string(),
        xboxUserHash: z.string(),
        email: z.string(),
        role: z.union([z.literal("user"), z.literal('admin')]).default("user"),
    }),
    tokens: z.object({
        microsoft: z.string(),
        xbox: z.string(),
        xsts: z.string(),
    }),
    accessToken: z.string(),
    refreshToken: z.string(),
});

export type SunriseJWT = z.infer<typeof JWTSchema>;

export const getParsedToken = async (
    ...params: Parameters<typeof getToken>
  ): Promise<SunriseJWT | undefined> => {
    const token = await getToken(...params);
    const parsed = JWTSchema.safeParse(token);
    if (!parsed.success) throw new Error(JSON.stringify(parsed.error));
    if (!parsed.success) return undefined;
    return parsed.data;
  };
  