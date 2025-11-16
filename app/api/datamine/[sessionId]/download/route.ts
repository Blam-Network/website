import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { env } from "@/src/env";

export async function GET(
    req: NextRequest,
    { params }: { params: { sessionId: string } }
) {
    try {
        // Get the encrypted JWE token from NextAuth cookie
        const encryptedToken = await getToken({ 
            req, 
            secret: env.NEXTAUTH_SECRET, 
            raw: true 
        }) as string | null;

        if (!encryptedToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const sessionId = params.sessionId;

        // Proxy the request to the backend
        const backendUrl = `${env.HALO3_API_BASE_URL}/datamine/sessions/${sessionId}/events/all`;
        const response = await fetch(backendUrl, {
            headers: {
                'Authorization': `Bearer ${encryptedToken}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to download log file' },
                { status: response.status }
            );
        }

        // Get the blob from the backend response
        const blob = await response.blob();

        // Return the file with proper headers
        return new NextResponse(blob, {
            headers: {
                'Content-Type': 'text/plain',
                'Content-Disposition': response.headers.get('Content-Disposition') || `attachment; filename="${sessionId}_datamine.txt"`,
            },
        });
    } catch (error) {
        console.error('Error downloading datamine log:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

