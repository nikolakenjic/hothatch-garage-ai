import {isAxiosError} from 'axios';

export function isUnauthorizedError(error: unknown): boolean {
    return isAxiosError(error) && error.response?.status === 401;
}

export function isNotFoundError(error: unknown): boolean {
    return isAxiosError(error) && error.response?.status === 404;
}

export function getErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        return error.response?.data?.message ?? error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Something went wrong';
}
