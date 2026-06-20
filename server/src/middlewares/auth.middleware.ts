import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {env} from '../config/env';
import mongoose from 'mongoose';

type DecodedToken = {
    userId: string;
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({
            message: 'Not authorized, no token',
        });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken;

        req.user = {
            userId: new mongoose.Types.ObjectId(decoded.userId),
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Not authorized, invalid token',
        });
    }
};
