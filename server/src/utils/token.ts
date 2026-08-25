import jwt, {SignOptions} from 'jsonwebtoken';
import crypto from 'crypto';
import {z} from 'zod';
import mongoose from 'mongoose';
import {env} from '../config/env';
import {AppError} from './AppError';
import {UNAUTHORIZED} from '../constants/http';
import {
    ACCESS_TOKEN_TTL_SECONDS,
    REFRESH_TOKEN_TTL_SECONDS,
} from '../constants/auth.constants';

const tokenPayloadSchema = z.object({
    userId: z
        .string()
        .min(1)
        .refine(
            (userId) => mongoose.isValidObjectId(userId),
            'Invalid user id',
        ),
});

export type TokenPayload = z.infer<typeof tokenPayloadSchema>;

const verifyToken = (token: string, secret: string): TokenPayload => {
    try {
        const decoded = jwt.verify(token, secret, {
            algorithms: ['HS256'],
        });

        return tokenPayloadSchema.parse(decoded);
    } catch {
        throw new AppError('Invalid or expired token', UNAUTHORIZED);
    }
};

const accessTokenOptions: SignOptions = {
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    algorithm: 'HS256',
};

const refreshTokenOptions: SignOptions = {
    expiresIn: REFRESH_TOKEN_TTL_SECONDS,
    algorithm: 'HS256',
};

export const signAccessToken = (userId: string) => {
    return jwt.sign({userId}, env.JWT_SECRET, accessTokenOptions);
};

export const signRefreshToken = (userId: string) => {
    return jwt.sign({userId}, env.JWT_REFRESH_SECRET, refreshTokenOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
    return verifyToken(token, env.JWT_SECRET);
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    return verifyToken(token, env.JWT_REFRESH_SECRET);
};

export const generateToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

export const hashToken = (token: string): string => {
    return crypto.createHash('sha256').update(token).digest('hex');
};
