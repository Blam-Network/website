import { AuthOptions } from "next-auth";
import XboxLive from "../XboxLive";
import { JWT } from "next-auth/jwt";
import { env } from "../env";
import { fetchBnetUserFlags } from "@/server/auth/bnetUser";
import { SunriseJWT } from "@/server/auth/jwt";

export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    providers: [
      XboxLive({
        clientId: env.AZURE_AD_CLIENT_ID,
        clientSecret: env.AZURE_AD_CLIENT_SECRET,
      })
    ],
    callbacks: {
      jwt: async ({token, user, account, profile}): Promise<JWT> => {
        if (account && profile) {
          const bnetUser = await fetchBnetUserFlags(user.xuid, user.userHash, user.xstsToken);

          return {
            user: {
              xuid: user.xuid,
              gamertag: user.gamertag,
              xboxUserHash: user.userHash,
              email: user.email,
              datamine_access: bnetUser.datamine_access,
              is_admin: bnetUser.is_admin,
            },
            tokens: {
              microsoft: account.access_token,
              xbox: user.xboxToken,
              xboxTokenExpiresAt: user.xboxTokenExpiresAt,
              xsts: user.xstsToken,
              xstsTokenExpiresAt: user.xstsTokenExpiresAt,
            },
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
          };
        }
        else {
          const sunriseJWT = token as Partial<SunriseJWT> & { error?: string };

          if (!sunriseJWT.user || !sunriseJWT.tokens) {
            return { error: "SessionExpired" };
          }

          if (
            sunriseJWT.tokens.xbox &&
            sunriseJWT.tokens.xboxTokenExpiresAt &&
            Date.now() > sunriseJWT.tokens.xboxTokenExpiresAt
          ) {
            return { error: "SessionExpired" };
          }
          if (
            sunriseJWT.tokens.xsts &&
            sunriseJWT.tokens.xstsTokenExpiresAt &&
            Date.now() > sunriseJWT.tokens.xstsTokenExpiresAt
          ) {
            return { error: "SessionExpired" };
          }

          return token as JWT;
        }
      },
      session({ session, token }) {
        const sunriseJWT = token as Partial<SunriseJWT> & { error?: string };
        if (
          sunriseJWT.error === "SessionExpired" ||
          !sunriseJWT.user ||
          !sunriseJWT.tokens
        ) {
          return {
            expires: session.expires,
            error: "SessionExpired",
          } as typeof session;
        }

        return {
        // TODO: clean this up
          user: sunriseJWT.user,
          accessToken: sunriseJWT.accessToken,
          expires: 0,
          tokens: {
            microsoft: sunriseJWT.tokens.microsoft,
            xbox: sunriseJWT.tokens.xbox,
            xsts: sunriseJWT.tokens.xsts,
          }
        }
      },
    },
    secret: env.NEXTAUTH_SECRET,
  }