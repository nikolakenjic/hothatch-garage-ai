import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {env} from '../config/env';
import mongoose from 'mongoose';

type DecodedToken = {
    userId: string;
    email: string;
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Not authorized, no token',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken;

        req.user = {
            userId: new mongoose.Types.ObjectId(decoded.userId),
            email: decoded.email,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Not authorized, invalid token',
        });
    }
};
