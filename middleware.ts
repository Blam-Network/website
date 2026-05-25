import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getParsedToken } from "@/server/auth/jwt";

export async function middleware(req: NextRequest) {
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
  matcher: ["/admin", "/admin/:path*"],
};
