import {NextFunction, Request, Response} from 'express';
import {z} from 'zod';
import {AppError} from '../utils/AppError';
import {BAD_REQUEST} from '../constants/http';

type ValidateTarget = 'body' | 'params' | 'query';

export const validate =
    (schema: z.ZodType, target: ValidateTarget = 'body') =>
    (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[target]);

        if (!result.success) {
            const details = result.error.issues.map((issue) => ({
                field: issue.path.join('.') || target,
                message: issue.message,
            }));

            throw new AppError('Validation failed', BAD_REQUEST, details);
        }

        req[target] = result.data;
        next();
    };
