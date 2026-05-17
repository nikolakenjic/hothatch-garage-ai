import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './modules/auth/auth.route';
import carRoutes from './modules/car/car.routes';
import modificationRoutes from './modules/modification/modification.routes';
import aiRoutes from './modules/ai/ai.routes';
import {errorHandler} from './middlewares/errorHandler';

const app = express();

app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cars', carRoutes);
app.use('/api/v1/modifications', modificationRoutes);
app.use('/api/v1/ai', aiRoutes);

app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({
        message: 'HotHatch Garage AI API is running',
    });
});

app.use(errorHandler);

export default app;
