import type { NextRequest } from "next/server";
import { getParsedToken } from "@/server/auth/jwt";
import { createTRPCContext } from "@/src/api/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { edgeRouter } from "@/src/api/edge";
import { getToken } from "next-auth/jwt";
import { env } from "@/src/env";

export const runtime = "edge";

const createContext = async (req: NextRequest) => {
  // Get the encrypted JWE token from NextAuth cookie
  // This will be sent to the backend where it will be decrypted
  const encryptedToken = await getToken({ 
    req, 
    secret: env.NEXTAUTH_SECRET, 
    raw: true 
  }) as string | null;

  return createTRPCContext({
    headers: req.headers,
    auth: (await getParsedToken({ req })),
    jwtTokenString: encryptedToken, // Send the encrypted JWE token to backend
    req,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc/edge",
    router: edgeRouter,
    req: req,
    createContext: () => createContext(req),
    onError: ({ error, path }) => {
      console.log("Error in tRPC handler (edge) on path", path);
      console.error(error);
    },
  });

export { handler as GET, handler as POST };