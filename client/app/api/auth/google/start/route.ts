import {NextResponse} from 'next/server';
import * as oidc from 'openid-client';

import {getGoogleConfiguration, getGoogleRedirectUri} from '@/lib/auth/google';
import {
    encryptGoogleTransaction,
    GOOGLE_TRANSACTION_COOKIE,
    GOOGLE_TRANSACTION_TTL,
} from '@/lib/auth/google-transaction';

export const runtime = 'nodejs';

export async function GET() {
    const configuration = await getGoogleConfiguration();

    const state = oidc.randomState();
    const nonce = oidc.randomNonce();
    const codeVerifier = oidc.randomPKCECodeVerifier();

    const codeChallenge = await oidc.calculatePKCECodeChallenge(codeVerifier);

    const authorizationUrl = oidc.buildAuthorizationUrl(configuration, {
        redirect_uri: getGoogleRedirectUri(),
        scope: 'openid email profile',
        response_type: 'code',
        state,
        nonce,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
    });

    const encryptedTransaction = encryptGoogleTransaction({
        state,
        nonce,
        codeVerifier,
        expiresAt: Date.now() + GOOGLE_TRANSACTION_TTL * 1000,
    });

    const response = NextResponse.redirect(authorizationUrl);

    response.cookies.set(GOOGLE_TRANSACTION_COOKIE, encryptedTransaction, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth/google',
        maxAge: GOOGLE_TRANSACTION_TTL,
    });

    return response;
}
