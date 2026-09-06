import {AppError} from './AppError';

export function appAssert(
    condition: unknown,
    statusCode: number,
    message: string,
): asserts condition {
    if (!condition) {
        throw new AppError(message, statusCode);
    }
}
