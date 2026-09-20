import {NextRequest, NextResponse} from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
    const cookieHeader = request.headers.get('cookie') ?? '';

    const backendResponse = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
            Cookie: cookieHeader,
        },
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, {
        status: backendResponse.status,
    });
}
