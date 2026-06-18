import jwt, {SignOptions} from 'jsonwebtoken';
import {env} from '../config/env';

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
