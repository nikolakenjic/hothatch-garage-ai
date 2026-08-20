import jwt, {SignOptions} from 'jsonwebtoken';
import crypto from 'crypto';
import {env} from '../config/env';
import {AppError} from './AppError';
import {UNAUTHORIZED} from '../constants/http';

const accessTokenOptions: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    algorithm: 'HS256',
};

const refreshTokenOptions: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
    algorithm: 'HS256',
};

export const signAccessToken = (userId: string) => {
    return jwt.sign({userId}, env.JWT_SECRET, accessTokenOptions);
};

export const signRefreshToken = (userId: string) => {
    return jwt.sign({userId}, env.JWT_REFRESH_SECRET, refreshTokenOptions);
};

export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET, {
            algorithms: ['HS256'],
        }) as unknown as {userId: string};
    } catch {
        throw new AppError('Invalid or expired refresh token', UNAUTHORIZED);
    }
};

export const generateToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

export const hashToken = (token: string): string => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

export const getTokenExpiration = (token: string): Date => {
    const decoded = jwt.decode(token);

    if (
        !decoded ||
        typeof decoded === 'string' ||
        typeof decoded.exp !== 'number'
    ) {
        throw new Error('Token expiration is missing');
    }

    return new Date(decoded.exp * 1000);
};
