import {ErrorRequestHandler} from 'express';
import {AppError} from '../utils/AppError';
import {INTERNAL_SERVER_ERROR} from '../constants/http';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            ...(err.details && {
                errors: err.details,
            }),
        });
        return;
    }

    console.error(err);

    res.status(INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};
