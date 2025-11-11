import { NextResponse } from "next/server";
import { sunrise2Axios } from "@/src/api/sunrise/sunrise2Router";

export async function GET() {
    const response = await sunrise2Axios.get('/halo3/nightmap', {
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

