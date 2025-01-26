
import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    expires: number;
    user: {
        xuid: string,
        gamertag: string,
        xboxUserHash: string,
        email: string,
        role: "user" | "admin",
    };
    tokens: {
      microsoft: string,
      xbox: string,
      xsts: string,
    }
  }

  interface User {
    xuid: string;
    gamertag: string;
    userHash: string;
    email: string;
    accessToken: string;
    idToken: string;
    expiresIn: number;
    refreshToken: string;
    xboxToken: string;
    xstsToken: string;
  }
}
