import {NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import {AppError} from '../utils/AppError';
import {UNAUTHORIZED} from '../constants/http';
import {verifyAccessToken} from '../utils/token';

export const protect = (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        throw new AppError('Not authorized, no token', UNAUTHORIZED);
    }

    const {userId} = verifyAccessToken(token);

    req.user = {
        userId: new mongoose.Types.ObjectId(userId),
    };

    next();
};
