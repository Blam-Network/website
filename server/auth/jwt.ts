import { getToken, JWT } from "next-auth/jwt";
import { z } from "zod";

const JWTSchema = z.object({
    user: z.object({
        xuid: z.string(),
        gamertag: z.string(),
        xboxUserHash: z.string(),
        email: z.string(),
        datamine_access: z.boolean().default(false),
        is_admin: z.boolean().default(false),
    }),
    tokens: z.object({
        microsoft: z.string(),
        xbox: z.string(),
        xboxTokenExpiresAt: z.number().optional(),
        xsts: z.string(),
        xstsTokenExpiresAt: z.number().optional(),
    }),
    accessToken: z.string(),
    refreshToken: z.string().optional(),
});

export type SunriseJWT = z.infer<typeof JWTSchema>;

export const getParsedToken = async (
    ...params: Parameters<typeof getToken>
  ): Promise<SunriseJWT | undefined> => {
    const token = await getToken(...params);
    if (token === null) return undefined;
    const parsed = JWTSchema.safeParse(token);
    if (!parsed.success) return undefined;
    return parsed.data;
  };
  