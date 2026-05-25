import { NextRequest, NextResponse } from "next/server";
import { env } from "@/src/env";
import { getParsedToken } from "@/server/auth/jwt";

export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
    const token = await getParsedToken({ req, secret: env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!token.user.is_admin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return null;
}
