import {ErrorRequestHandler} from 'express';
import {AppError} from '../utils/AppError';
import {INTERNAL_SERVER_ERROR} from '../constants/http';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        return;
    }

    res.status(INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};
