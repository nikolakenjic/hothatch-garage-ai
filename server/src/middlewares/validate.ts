import {NextFunction, Request, Response} from 'express';
import {z} from 'zod';
import {AppError} from '../utils/AppError';
import {BAD_REQUEST} from '../constants/http';

type ValidateTarget = 'body' | 'params' | 'query';

declare module 'express-serve-static-core' {
    interface Request {
        validated?: Partial<Record<ValidateTarget, unknown>>;
    }
}

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

        if (target === 'body') {
            req.body = result.data;
        } else {
            req.validated = {...req.validated, [target]: result.data};
        }

        next();
    };
