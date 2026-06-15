import {NextFunction, Request, Response} from 'express';

type AsyncController = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<void>;

export const catchAsync = (fn: AsyncController) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};
