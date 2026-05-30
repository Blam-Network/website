import { NextRequest, NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { env } from "@/src/env";
import { requireAdmin } from "@/server/auth/requireAdmin";
import { getParsedToken } from "@/server/auth/jwt";
import {
    isReachAdminFileshareTarget,
    reachAdminFileshareShareId,
} from "@/src/constants/reachAdminFileshare";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { target: string; fileId: string } },
) {
    if (!isReachAdminFileshareTarget(params.target)) {
        return NextResponse.json({ error: "Invalid fileshare target" }, { status: 400 });
    }

    const authError = await requireAdmin(req);
    if (authError) return authError;

    const session = await getParsedToken({ req, secret: env.NEXTAUTH_SECRET });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const uploadToken = await encode({
        token: {
            user: {
                xuid: session.user.xuid,
                gamertag: session.user.gamertag,
                xboxUserHash: session.user.xboxUserHash,
                email: session.user.email,
            },
        },
        secret: env.NEXTAUTH_SECRET,
        maxAge: 5 * 60,
    });

    try {
        const shareId = reachAdminFileshareShareId(params.target);
        const baseUrl = env.HALO_REACH_API_BASE_URL.replace(/\/$/, "");
        const deleteUrl = new URL(`${baseUrl}/haloreach/fileshare/files/${encodeURIComponent(params.fileId)}`);
        deleteUrl.searchParams.set("shareId", shareId);

        const deleteResponse = await fetch(deleteUrl.toString(), {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${uploadToken}`,
            },
        });

        const responseText = await deleteResponse.text();
        if (!deleteResponse.ok) {
            let details = responseText;
            try {
                const parsed = JSON.parse(responseText) as { message?: string | string[] };
                if (typeof parsed.message === "string") {
                    details = parsed.message;
                } else if (Array.isArray(parsed.message)) {
                    details = parsed.message.join(", ");
                }
            } catch {
                // keep raw body
            }
            return NextResponse.json(
                { error: "Failed to delete Reach file", details },
                { status: deleteResponse.status },
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[reach/admin/fileshare/delete]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
