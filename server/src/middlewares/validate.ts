import {NextFunction, Request, Response} from 'express';
import {z} from 'zod';
import {AppError} from '../utils/AppError';

type ValidateTarget = 'body' | 'params' | 'query';

export const validate =
    (schema: z.ZodType, target: ValidateTarget = 'body') =>
    (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[target]);

        if (!result.success) {
            const message = result.error.issues[0]?.message || 'Invalid input';
            throw new AppError(message, 400);
        }

        req[target] = result.data;
        next();
    };
