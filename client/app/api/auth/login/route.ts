import {NextRequest, NextResponse} from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
    const body = await request.json();

    const backendResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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
