import { AuthOptions } from "next-auth";
import XboxLive from "../XboxLive";
import { JWT } from "next-auth/jwt";
import { env } from "../env";
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
      jwt: ({token, user, account, profile}): JWT => {
        if (account && profile) {
          return {
            user: {
              xuid: user.xuid,
              gamertag: user.gamertag,
              xboxUserHash: user.userHash,
              email: user.email,
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
          // if the tokens have expired, logout
          const sunriseJWT = token as SunriseJWT;
          if (sunriseJWT.tokens.xbox && sunriseJWT.tokens.xboxTokenExpiresAt && Date.now() > sunriseJWT.tokens.xboxTokenExpiresAt) {
            return {};
          }
          if (sunriseJWT.tokens.xsts && sunriseJWT.tokens.xstsTokenExpiresAt && Date.now() > sunriseJWT.tokens.xstsTokenExpiresAt) {
            return {};
          }
          
          return token as JWT;
        }
      },
      session({ session, token, user }) {
        return {
        // TODO: clean this up
          user: (token as SunriseJWT).user,
          accessToken: (token as SunriseJWT).accessToken,
          expires: 0,
          tokens: {
            microsoft: (token as SunriseJWT).tokens.microsoft,
            xbox: (token as SunriseJWT).tokens.xbox,
            xsts: (token as SunriseJWT).tokens.xsts,
          }
        }
      },
    },
    secret: env.NEXTAUTH_SECRET,
  }