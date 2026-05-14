import {Request} from 'express';
import {UNAUTHORIZED} from '../constants/http';
import {AppError} from './AppError';

export const getUserId = (req: Request): string => {
    if (!req.user?.userId)
        throw new AppError('Not Authenticated', UNAUTHORIZED);

    return req.user.userId.toString();
};
