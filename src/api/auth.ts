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
              email: user.email,
            },
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
          };
        }
        else {
          return token as JWT;
        }
      },
      session({ session, token, user }) {
        return {
        // TODO: clean this up
          user: (token as SunriseJWT).user,
          expires: 0,
        }
      },
    },
    secret: env.NEXTAUTH_SECRET,
  }