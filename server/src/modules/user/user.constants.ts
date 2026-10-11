import type {Options} from 'express-rate-limit';

type RateLimitConfig = Partial<Options> & {
    windowMs: number;
    max: number;
    message: string;
};

export const CHANGE_PASSWORD_RATE_LIMIT: RateLimitConfig = {
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many password change attempts, try again later',
};
