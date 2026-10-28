import {NextRequest, NextResponse} from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
}

function getSafeReturnTo(request: NextRequest): string {
    const returnTo = request.nextUrl.searchParams.get('returnTo');

    if (
        !returnTo ||
        !returnTo.startsWith('/') ||
        returnTo.startsWith('//') ||
        returnTo.includes('\\') ||
        /[\u0000-\u001F\u007F]/.test(returnTo)
    ) {
        return '/garage';
    }

    try {
        const target = new URL(returnTo, request.url);

        if (target.origin !== request.nextUrl.origin) {
            return '/garage';
        }

        return `${target.pathname}${target.search}${target.hash}`;
    } catch {
        return '/garage';
    }
}

async function refreshSession(request: NextRequest) {
    const cookieHeader = request.headers.get('cookie') ?? '';

    const backendResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            Cookie: cookieHeader,
        },
        cache: 'no-store',
    });

    const data = await backendResponse.json();

    const response = NextResponse.json(data, {
        status: backendResponse.status,
    });

    for (const cookie of backendResponse.headers.getSetCookie()) {
        response.headers.append('Set-Cookie', cookie);
    }

    return response;
}

export async function POST(request: NextRequest) {
    return refreshSession(request);
}

export async function GET(request: NextRequest) {
    const fetchSite = request.headers.get('sec-fetch-site');

    if (fetchSite === 'cross-site') {
        return NextResponse.json(
            {message: 'Cross-site refresh is not allowed'},
            {status: 403},
        );
    }

    const safeReturnTo = getSafeReturnTo(request);

    const cookieHeader = request.headers.get('cookie') ?? '';

    const backendResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            Cookie: cookieHeader,
        },
        cache: 'no-store',
    });

    if (backendResponse.status === 401) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (!backendResponse.ok) {
        return NextResponse.json(
            {message: 'Unable to refresh session'},
            {status: 502},
        );
    }

    const response = NextResponse.redirect(new URL(safeReturnTo, request.url));

    for (const cookie of backendResponse.headers.getSetCookie()) {
        response.headers.append('Set-Cookie', cookie);
    }

    return response;
}
