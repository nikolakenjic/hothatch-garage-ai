import {NextRequest, NextResponse} from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
}

const ALLOWED_PREFIXES = new Set(['cars', 'modifications', 'users', 'ai']);

type RouteContext = {
    params: Promise<{
        path: string[];
    }>;
};

async function proxyRequest(request: NextRequest, context: RouteContext) {
    const {path} = await context.params;

    const [root] = path;

    if (!root || !ALLOWED_PREFIXES.has(root)) {
        return NextResponse.json({message: 'Route not allowed'}, {status: 404});
    }

    const backendPath = path.join('/');

    const targetUrl = new URL(`${API_URL}/${backendPath}`);

    request.nextUrl.searchParams.forEach((value, key) => {
        targetUrl.searchParams.append(key, value);
    });

    const cookieHeader = request.headers.get('cookie') ?? '';

    const hasBody = !['GET', 'HEAD'].includes(request.method);

    const backendResponse = await fetch(targetUrl, {
        method: request.method,
        headers: {
            Cookie: cookieHeader,
            ...(request.headers.get('content-type') && {
                'Content-Type': request.headers.get('content-type')!,
            }),
        },
        body: hasBody ? await request.text() : undefined,
    });

    const hasResponseBody = ![204, 205, 304].includes(backendResponse.status);

    const responseBody = hasResponseBody ? await backendResponse.text() : null;

    const response = new NextResponse(responseBody, {
        status: backendResponse.status,
    });
    const contentType = backendResponse.headers.get('content-type');

    if (contentType) {
        response.headers.set('Content-Type', contentType);
    }

    const setCookies = backendResponse.headers.getSetCookie();

    for (const cookie of setCookies) {
        response.headers.append('Set-Cookie', cookie);
    }

    return response;
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
