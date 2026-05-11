import { NextResponse } from "next/server";
import { halo3Axios } from "@/src/api/halo3/halo3Axios";

export const dynamic = 'force-dynamic';

export async function GET() {
    const response = await halo3Axios.get('/halo3/nightmap', {
        responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data);
    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        },
    });
}

