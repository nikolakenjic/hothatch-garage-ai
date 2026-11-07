import {ErrorRequestHandler} from 'express';
import {MongoServerError} from 'mongodb';
import {AppError} from '../utils/AppError';
import {
    BAD_REQUEST,
    CONFLICT,
    INTERNAL_SERVER_ERROR,
    PAYLOAD_TOO_LARGE,
} from '../constants/http';

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

    if (err instanceof Error && 'type' in err && 'status' in err) {
        if (err.type === 'entity.parse.failed' && err.status === BAD_REQUEST) {
            res.status(BAD_REQUEST).json({
                status: 'fail',
                message: 'Invalid JSON body',
            });
            return;
        }

        if (err.type === 'entity.too.large' && err.status === PAYLOAD_TOO_LARGE) {
            res.status(PAYLOAD_TOO_LARGE).json({
                status: 'fail',
                message: 'Request body is too large',
            });
            return;
        }
    }

    console.error(err);

    res.status(INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};
