import { AuthOptions } from "next-auth";
import XboxLive from "../XboxLive";
import { JWT } from "next-auth/jwt";
import { env } from "../env";
import { SunriseJWT } from "@/server/auth/jwt";
import { Axios } from "axios";

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
      session({ session, token }) {
        const sunriseJWT = token as SunriseJWT;
        
        // Note: User registration will happen when they first access a protected endpoint
        // The JWT token will be extracted from the cookie and sent to the backend
        
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