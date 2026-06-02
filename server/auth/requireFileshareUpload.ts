import { NextRequest, NextResponse } from "next/server";
import { env } from "@/src/env";
import { getParsedToken } from "@/server/auth/jwt";
import {
  canUploadToAdminFileshareTarget,
  type ReachFileshareSessionUser,
} from "@/src/lib/reachFileshareAccess";
import type { ReachAdminFileshareTarget } from "@/src/constants/reachAdminFileshare";

export async function requireFileshareUploadAccess(
  req: NextRequest,
  target: ReachAdminFileshareTarget,
): Promise<{ error: NextResponse } | { user: ReachFileshareSessionUser }> {
  const token = await getParsedToken({ req, secret: env.NEXTAUTH_SECRET });
  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!canUploadToAdminFileshareTarget(token.user, target)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user: token.user };
}
