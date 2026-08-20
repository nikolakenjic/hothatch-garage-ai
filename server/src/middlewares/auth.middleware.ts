import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {env} from '../config/env';
import mongoose from 'mongoose';
import {AppError} from '../utils/AppError';
import {UNAUTHORIZED} from '../constants/http';

type DecodedToken = {
    userId: string;
};

export const protect = (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        throw new AppError('Not authorized, no token', UNAUTHORIZED);
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET, {
            algorithms: ['HS256'],
        }) as DecodedToken;
        req.user = {userId: new mongoose.Types.ObjectId(decoded.userId)};
        next();
    } catch {
        throw new AppError('Not authorized, invalid token', UNAUTHORIZED);
    }
};
