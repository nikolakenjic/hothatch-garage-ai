import type {Options} from 'express-rate-limit';

type RateLimitConfig = Partial<Options> & {
    windowMs: number;
    max: number;
    message: string;
};

export const AI_MODELS = {
    RECOMMENDATION: 'openai/gpt-oss-120b',
} as const;

export const AI_GENERATION_RATE_LIMIT: RateLimitConfig = {
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many AI requests, try again later',
};
