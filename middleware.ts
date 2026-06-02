import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getParsedToken } from "@/server/auth/jwt";
import { isBlamnetworkFileshareUploadPath } from "@/server/auth/userFlags";

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  if (host === "www.blam.network") {
    const url = req.nextUrl.clone();
    url.host = "blam.network";
    return NextResponse.redirect(url, 308);
  }

  const pathname = req.nextUrl.pathname;
  const isReachAdminRoute =
    pathname.startsWith("/reach/lobbies") ||
    pathname.startsWith("/reach/admin") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  if (!isReachAdminRoute) {
    return NextResponse.next();
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const token = await getParsedToken({ req, secret });
  const user = token?.user;

  if (isBlamnetworkFileshareUploadPath(pathname)) {
    if (user?.is_admin || user?.is_uploader) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!user?.is_admin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
