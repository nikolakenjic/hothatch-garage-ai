import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {env} from './config/env';

import authRoutes from './modules/auth/auth.routes';
import carRoutes from './modules/car/car.routes';
import modificationRoutes from './modules/modification/modification.routes';
import aiRoutes from './modules/ai/ai.routes';
import {errorHandler} from './middlewares/errorHandler';
import {AppError} from './utils/AppError';
import {NOT_FOUND} from './constants/http';

import userRoutes from './modules/user/user.routes';

const app = express();

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cars', carRoutes);
app.use('/api/v1/modifications', modificationRoutes);
app.use('/api/v1/ai', aiRoutes);

app.use('/api/v1/users', userRoutes);

app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({
        message: 'HotHatch Garage AI API is running',
    });
});

app.use((_req, _res, next) => {
    next(new AppError('Route not found', NOT_FOUND));
});

app.use(errorHandler);

export default app;
