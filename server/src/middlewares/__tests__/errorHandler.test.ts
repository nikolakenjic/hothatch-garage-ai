import express from 'express';
import request from 'supertest';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import app from '../../app';
import {AppError} from '../../utils/AppError';
import {errorHandler} from '../errorHandler';

vi.mock('../../utils/email/email.service', () => ({
    sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
    sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}));

beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('API request body errors', () => {
    it.each([
        {name: 'malformed JSON', body: '{"email":"private@example.com"'},
        {name: 'a JSON primitive', body: '"private-value"'},
    ])('returns 400 for $name without exposing the body or parser error', async ({body}) => {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .set('Content-Type', 'application/json')
            .send(body);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: 'fail',
            message: 'Invalid JSON body',
        });
        expect(console.error).not.toHaveBeenCalled();
    });

    it('returns 413 when JSON exceeds the configured 100 KB limit', async () => {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({privateValue: 'x'.repeat(101 * 1024)});

        expect(response.status).toBe(413);
        expect(response.body).toEqual({
            status: 'fail',
            message: 'Request body is too large',
        });
        expect(console.error).not.toHaveBeenCalled();
    });

    it('keeps valid JSON on the normal route validation path', async () => {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({email: 'invalid-email', password: 'short'});

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('fail');
        expect(response.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({field: 'email'}),
            expect.objectContaining({field: 'password'}),
        ]));
        expect(console.error).not.toHaveBeenCalled();
    });
});

const createErrorApp = (error: Error) => {
    const errorApp = express();
    errorApp.get('/error', () => {
        throw error;
    });
    errorApp.use(errorHandler);
    return errorApp;
};

describe('error handler fallback', () => {
    it('preserves application error status and validation details', async () => {
        const details = [{field: 'email', message: 'Invalid email'}];
        const response = await request(createErrorApp(
            new AppError('Validation failed', 400, details),
        )).get('/error');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: 'fail',
            message: 'Validation failed',
            errors: details,
        });
    });

    it.each([
        {name: 'an unexpected error', error: new Error('Sensitive database details')},
        {
            name: 'an unrecognized error with a status property',
            error: Object.assign(new Error('Sensitive internal details'), {
                status: 400,
                type: 'unrecognized.error',
            }),
        },
    ])('returns a generic 500 for $name', async ({error}) => {
        const response = await request(createErrorApp(error)).get('/error');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: 'error',
            message: 'Internal Server Error',
        });
        expect(console.error).toHaveBeenCalledWith(error);
    });
});
