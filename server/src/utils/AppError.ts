export type ErrorDetail = {
    field: string;
    message: string;
};

export class AppError extends Error {
    statusCode: number;
    status: 'fail' | 'error';
    isOperational: boolean;
    details?: ErrorDetail[];

    constructor(message: string, statusCode: number, details?: ErrorDetail[]) {
        super(message);

        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}
