import type {Options} from 'express-rate-limit';

type RateLimitConfig = Partial<Options> & {
    windowMs: number;
    max: number;
    message: string;
};

export const BCRYPT_SALT_ROUNDS = 12;
export const EMAIL_VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
export const PASSWORD_RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15min

export const REGISTER_RATE_LIMIT: RateLimitConfig = {
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many registration attempts, try again later',
};

export const LOGIN_RATE_LIMIT: RateLimitConfig = {
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, try again later',
};

export const REQUEST_PASSWORD_RESET_RATE_LIMIT: RateLimitConfig = {
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: 'Too many password reset requests, try again later',
};

export const CONFIRM_PASSWORD_RESET_RATE_LIMIT: RateLimitConfig = {
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many attempts, try again later',
};

export const RESEND_VERIFICATION_RATE_LIMIT: RateLimitConfig = {
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: 'Too many verification email requests, try again later',
};

export const REFRESH_RATE_LIMIT: RateLimitConfig = {
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: 'Too many refresh attempts, try again later',
};

export const VERIFY_EMAIL_RATE_LIMIT: RateLimitConfig = {
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Too many verification attempts, try again later',
};

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

export const ACCESS_TOKEN_COOKIE_TTL_MS = ACCESS_TOKEN_TTL_SECONDS * 1000;
export const REFRESH_TOKEN_COOKIE_TTL_MS = REFRESH_TOKEN_TTL_SECONDS * 1000;
