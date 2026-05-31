import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const isPublicPage =
        request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register');

    if (!token && !isPublicPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isPublicPage && request.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/garage', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
