import {NextRequest, NextResponse} from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
    const cookieHeader = request.headers.get('cookie') ?? '';

    const backendResponse = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            Cookie: cookieHeader,
        },
    });

    const data = await backendResponse.json();

    const response = NextResponse.json(data, {
        status: backendResponse.status,
    });

    const setCookies = backendResponse.headers.getSetCookie();

    for (const cookie of setCookies) {
        response.headers.append('Set-Cookie', cookie);
    }

    return response;
}
