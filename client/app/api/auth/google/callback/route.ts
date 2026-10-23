import {NextRequest, NextResponse} from 'next/server';
import * as oidc from 'openid-client';

import {getGoogleConfiguration} from '@/lib/auth/google';
import {
    decryptGoogleTransaction,
    GOOGLE_TRANSACTION_COOKIE,
} from '@/lib/auth/google-transaction';

export const runtime = 'nodejs';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
    const loginUrl = new URL('/login', request.url);
    const cookieValue = request.cookies.get(GOOGLE_TRANSACTION_COOKIE)?.value;

    const fail = () => {
        const response = NextResponse.redirect(loginUrl);

        response.cookies.delete({
            name: GOOGLE_TRANSACTION_COOKIE,
            path: '/api/auth/google',
        });

        return response;
    };

    if (!cookieValue || !API_URL) {
        return fail();
    }

    try {
        const transaction = decryptGoogleTransaction(cookieValue);
        const configuration = await getGoogleConfiguration();

        const tokens = await oidc.authorizationCodeGrant(
            configuration,
            new URL(request.url),
            {
                pkceCodeVerifier: transaction.codeVerifier,
                expectedState: transaction.state,
                expectedNonce: transaction.nonce,
                idTokenExpected: true,
            },
        );

        const idToken = tokens.id_token;

        if (!idToken) {
            return fail();
        }

        const backendResponse = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({idToken}),
            cache: 'no-store',
        });

        if (!backendResponse.ok) {
            console.error('[GOOGLE AUTH] Backend login failed', {
                status: backendResponse.status,
            });

            return fail();
        }

        const authCookies = backendResponse.headers.getSetCookie();

        const hasAccessToken = authCookies.some((cookie) =>
            cookie.startsWith('accessToken='),
        );

        const hasRefreshToken = authCookies.some((cookie) =>
            cookie.startsWith('refreshToken='),
        );

        if (!hasAccessToken || !hasRefreshToken) {
            console.error('[GOOGLE AUTH] Missing authentication cookies');
            return fail();
        }

        const response = NextResponse.redirect(new URL('/garage', request.url));

        // Clear the temporary OAuth transaction cookie first.
        response.cookies.delete({
            name: GOOGLE_TRANSACTION_COOKIE,
            path: '/api/auth/google',
        });

        // Forward backend authentication cookies last.
        for (const cookie of authCookies) {
            response.headers.append('Set-Cookie', cookie);
        }

        return response;
    } catch (error) {
        console.error(
            '[GOOGLE AUTH] Callback failed',
            error instanceof Error ? error.name : 'Unknown error',
        );

        return fail();
    }
}
