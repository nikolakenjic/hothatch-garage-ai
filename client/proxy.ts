import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function proxy(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    const hasAuthSession = Boolean(accessToken || refreshToken);

    const isPublicPage =
        request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register');

    if (!hasAuthSession && !isPublicPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-current-path', request.nextUrl.pathname);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
