import { NextRequest, NextResponse } from "next/server";
import { env } from "@/src/env";
import { requireAdmin } from "@/server/auth/requireAdmin";

const BLAMNET_SYSTEM_XUID = 0xffffffffffffff10n;
const REACH_MACHINE_ID_HEX = "0000000000000000";
const REACH_SHAREDFILE_MIME = "application/x-reach-sharedfile";

function uniqueIdToHex(uniqueId: string): string {
    const trimmed = uniqueId.trim();
    if (/^[0-9a-fA-F]{16}$/.test(trimmed)) {
        return trimmed.toUpperCase();
    }
    return BigInt(trimmed).toString(16).toUpperCase().padStart(16, "0");
}

export async function POST(req: NextRequest) {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "file is required" }, { status: 400 });
        }

        const uniqueIdRaw = formData.get("uniqueId");
        const fileTypeRaw = formData.get("fileType");
        const uncompressedSizeRaw = formData.get("uncompressedSize");
        const compressedSizeRaw = formData.get("compressedSize");

        if (
            typeof uniqueIdRaw !== "string" ||
            typeof fileTypeRaw !== "string" ||
            typeof uncompressedSizeRaw !== "string" ||
            typeof compressedSizeRaw !== "string"
        ) {
            return NextResponse.json(
                { error: "uniqueId, fileType, uncompressedSize, and compressedSize are required" },
                { status: 400 },
            );
        }

        const fileType = Number.parseInt(fileTypeRaw, 10);
        const uncompressedSize = Number.parseInt(uncompressedSizeRaw, 10);
        const compressedSize = Number.parseInt(compressedSizeRaw, 10);

        if (
            Number.isNaN(fileType) ||
            Number.isNaN(uncompressedSize) ||
            Number.isNaN(compressedSize)
        ) {
            return NextResponse.json({ error: "Invalid numeric upload parameters" }, { status: 400 });
        }

        const uniqueIdHex = uniqueIdToHex(uniqueIdRaw);
        const baseUrl = env.REACH_LSP_BASE_URL.replace(/\/$/, "");

        const startParams = new URLSearchParams({
            machineId: REACH_MACHINE_ID_HEX,
            userId: BLAMNET_SYSTEM_XUID.toString(16).toUpperCase(),
            shareId: BLAMNET_SYSTEM_XUID.toString(16).toUpperCase(),
            uniqueId: uniqueIdHex,
            fileType: String(fileType),
            uncompressedSize: String(uncompressedSize),
            compressedSize: String(compressedSize),
        });

        const startResponse = await fetch(
            `${baseUrl}/gameapi_omaha/FilesNewUpload.ashx?${startParams.toString()}`,
            { method: "GET" },
        );

        if (!startResponse.ok) {
            const errorText = await startResponse.text();
            return NextResponse.json(
                { error: "Failed to start Reach file upload", details: errorText },
                { status: startResponse.status },
            );
        }

        const serverId = (await startResponse.text()).trim().replace(/^"|"$/g, "");
        if (!/^[0-9a-fA-F]{16}$/.test(serverId)) {
            return NextResponse.json(
                { error: "Invalid server id returned from LSP", details: serverId },
                { status: 502 },
            );
        }

        const fileBuffer = await file.arrayBuffer();
        const uploadForm = new FormData();
        uploadForm.append(
            "upload",
            new Blob([fileBuffer], { type: REACH_SHAREDFILE_MIME }),
            file.name || "upload.blf",
        );

        const uploadResponse = await fetch(`${baseUrl}/gameapi_omaha/FilesUpload.ashx`, {
            method: "POST",
            headers: {
                machineid: REACH_MACHINE_ID_HEX,
                userid: BLAMNET_SYSTEM_XUID.toString(16).toUpperCase(),
                shareid: BLAMNET_SYSTEM_XUID.toString(16).toUpperCase(),
                serverid: serverId.toUpperCase(),
            },
            body: uploadForm,
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            return NextResponse.json(
                { error: "Failed to upload Reach file", details: errorText },
                { status: uploadResponse.status },
            );
        }

        return NextResponse.json({
            serverId: serverId.toUpperCase(),
            shareId: BLAMNET_SYSTEM_XUID.toString(16).toUpperCase(),
        });
    } catch (error) {
        console.error("[reach/upload]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
