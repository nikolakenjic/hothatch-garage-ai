export const BCRYPT_SALT_ROUNDS = 12;
export const EMAIL_VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
export const PASSWORD_RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15min

export const REGISTER_RATE_LIMIT = {
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many registration attempts, try again later',
};
export const LOGIN_RATE_LIMIT = {
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many login attempts, try again later',
};
export const PASSWORD_RESET_RATE_LIMIT = {windowMs: 60 * 60 * 1000, max: 3};

export const ACCESS_TOKEN_COOKIE_TTL_MS = 15 * 60 * 1000; // 15 min
export const REFRESH_TOKEN_COOKIE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
