import jwt, {SignOptions} from 'jsonwebtoken';
import crypto from 'crypto';
import {env} from '../config/env';

// Later we should make stricter ENV validation, but for now let's leave like this
const accessTokenOptions: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
};

const refreshTokenOptions: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
};

export const signAccessToken = (userId: string) => {
    return jwt.sign({userId}, env.JWT_SECRET, accessTokenOptions);
};

export const signRefreshToken = (userId: string) => {
    return jwt.sign({userId}, env.JWT_REFRESH_SECRET, refreshTokenOptions);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as unknown as {
        userId: string;
    };
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
