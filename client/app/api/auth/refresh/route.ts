import {NextRequest, NextResponse} from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
}

async function refreshSession(request: NextRequest) {
    const cookieHeader = request.headers.get('cookie') ?? '';

    const backendResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            Cookie: cookieHeader,
        },
    });

    const data = await backendResponse.json();

    const response = NextResponse.json(data, {
        status: backendResponse.status,
    });

    const setCookie = backendResponse.headers.get('set-cookie');

    if (setCookie) {
        response.headers.set('set-cookie', setCookie);
    }

    return response;
}

export async function POST(request: NextRequest) {
    return refreshSession(request);
}

export async function GET(request: NextRequest) {
    const returnTo = request.nextUrl.searchParams.get('returnTo');

    const safeReturnTo =
        returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')
            ? returnTo
            : '/garage';

    const cookieHeader = request.headers.get('cookie') ?? '';

    const backendResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            Cookie: cookieHeader,
        },
    });

    if (!backendResponse.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const response = NextResponse.redirect(new URL(safeReturnTo, request.url));

    const setCookie = backendResponse.headers.get('set-cookie');

    if (setCookie) {
        response.headers.set('set-cookie', setCookie);
    }

    return response;
}
