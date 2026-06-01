import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getParsedToken } from "@/server/auth/jwt";

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  if (host === "www.blam.network") {
    const url = req.nextUrl.clone();
    url.host = "blam.network";
    return NextResponse.redirect(url, 308);
  }

  const isReachAdminRoute =
    req.nextUrl.pathname.startsWith("/reach/admin") ||
    req.nextUrl.pathname.startsWith("/reach/lobbies");

  if (!isReachAdminRoute) {
    return NextResponse.next();
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const token = await getParsedToken({ req, secret });
  if (!token?.user.is_admin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
