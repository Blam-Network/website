import { NextRequest, NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { env } from "@/src/env";
import { requireAdmin } from "@/server/auth/requireAdmin";
import { getParsedToken } from "@/server/auth/jwt";
import {
    isReachAdminFileshareTarget,
    reachAdminFileshareShareId,
} from "@/src/constants/reachAdminFileshare";

const REACH_SHAREDFILE_MIME = "application/x-reach-sharedfile";

export async function POST(
    req: NextRequest,
    { params }: { params: { target: string } },
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
        const incomingForm = await req.formData();
        const file = incomingForm.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "file is required" }, { status: 400 });
        }

        const uniqueIdRaw = incomingForm.get("uniqueId");
        const fileTypeRaw = incomingForm.get("fileType");
        const uncompressedSizeRaw = incomingForm.get("uncompressedSize");

        if (
            typeof uniqueIdRaw !== "string" ||
            typeof fileTypeRaw !== "string" ||
            typeof uncompressedSizeRaw !== "string"
        ) {
            return NextResponse.json(
                { error: "uniqueId, fileType, and uncompressedSize are required" },
                { status: 400 },
            );
        }

        const outgoingForm = new FormData();
        outgoingForm.append(
            "file",
            new Blob([await file.arrayBuffer()], { type: REACH_SHAREDFILE_MIME }),
            file.name || "upload.blf",
        );
        outgoingForm.append("uniqueId", uniqueIdRaw);
        outgoingForm.append("fileType", fileTypeRaw);
        outgoingForm.append("uncompressedSize", uncompressedSizeRaw);
        outgoingForm.append("shareId", reachAdminFileshareShareId(params.target));

        const baseUrl = env.HALO_REACH_API_BASE_URL.replace(/\/$/, "");
        const uploadResponse = await fetch(`${baseUrl}/haloreach/fileshare/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${uploadToken}`,
            },
            body: outgoingForm,
        });

        const responseText = await uploadResponse.text();
        if (!uploadResponse.ok) {
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
                { error: "Failed to upload Reach file", details },
                { status: uploadResponse.status },
            );
        }

        let payload: { serverId?: string; shareId?: string } = {};
        try {
            payload = JSON.parse(responseText) as { serverId?: string; shareId?: string };
        } catch {
            return NextResponse.json(
                { error: "Invalid response from Reach fileshare API", details: responseText.slice(0, 200) },
                { status: 502 },
            );
        }

        return NextResponse.json({
            serverId: payload.serverId,
            shareId: payload.shareId,
        });
    } catch (error) {
        console.error("[reach/upload]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
