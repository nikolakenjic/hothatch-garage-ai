import 'server-only';
import * as oidc from 'openid-client';

const GOOGLE_ISSUER = new URL('https://accounts.google.com');

function getGoogleEnv() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        throw new Error('Google OAuth configuration is incomplete');
    }

    return {clientId, clientSecret, redirectUri};
}

let configurationPromise: Promise<oidc.Configuration> | undefined;

export function getGoogleConfiguration() {
    if (!configurationPromise) {
        const {clientId, clientSecret} = getGoogleEnv();

        configurationPromise = oidc
            .discovery(GOOGLE_ISSUER, clientId, clientSecret)
            .catch((error: unknown) => {
                configurationPromise = undefined;
                throw error;
            });
    }

    return configurationPromise;
}

export function getGoogleRedirectUri() {
    return getGoogleEnv().redirectUri;
}
