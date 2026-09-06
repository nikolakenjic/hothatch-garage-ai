import {ErrorRequestHandler} from 'express';
import {MongoServerError} from 'mongodb';
import {AppError} from '../utils/AppError';
import {CONFLICT, INTERNAL_SERVER_ERROR} from '../constants/http';

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

    if (err instanceof MongoServerError && err.code === 11000) {
        const duplicateField = Object.keys(err.keyValue ?? {})[0];

        res.status(CONFLICT).json({
            status: 'fail',
            message: duplicateField
                ? `${duplicateField} already exists`
                : 'Resource already exists',
        });

        return;
    }

    console.error(err);

    res.status(INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};
