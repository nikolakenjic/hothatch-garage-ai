import {CookieOptions} from 'express';
import {env} from '../../config/env';
import {
    ACCESS_TOKEN_COOKIE_TTL_MS,
    REFRESH_TOKEN_COOKIE_TTL_MS,
} from '../../constants/auth.constants';

const baseCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    ...(env.COOKIE_DOMAIN && {
        domain: env.COOKIE_DOMAIN,
    }),
};

export const accessTokenCookieOptions: CookieOptions = {
    ...baseCookieOptions,
    maxAge: ACCESS_TOKEN_COOKIE_TTL_MS,
};

export const refreshTokenCookieOptions: CookieOptions = {
    ...baseCookieOptions,
    maxAge: REFRESH_TOKEN_COOKIE_TTL_MS,
};

export const authCookieClearOptions: CookieOptions = {
    ...baseCookieOptions,
};
