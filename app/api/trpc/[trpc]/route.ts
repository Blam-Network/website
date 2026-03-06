import type { NextRequest } from "next/server";
import { getParsedToken } from "@/server/auth/jwt";
import { createTRPCContext } from "@/src/api/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { apiRouter } from "@/src/api/edge";
import { getToken } from "next-auth/jwt";
import { env } from "@/src/env";

const createContext = async (req: NextRequest) => {
  const encryptedToken = (await getToken({
    req,
    secret: env.NEXTAUTH_SECRET,
    raw: true,
  })) as string | null;

  return createTRPCContext({
    headers: req.headers,
    auth: await getParsedToken({ req }),
    jwtTokenString: encryptedToken,
    req,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    router: apiRouter,
    req,
    createContext: () => createContext(req),
    onError: ({ error, path }) => {
      console.error("Error in tRPC handler on path", path, error);
    },
  });

export { handler as GET, handler as POST };
