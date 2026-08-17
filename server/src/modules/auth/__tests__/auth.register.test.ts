import request from 'supertest';
import {describe, expect, it, vi} from 'vitest';
import app from '../../../app';
import {User} from '../user.model';

vi.mock('../../../utils/email/email.service', () => ({
    sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
    sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}));

describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
        // Arrange
        const input = {
            email: 'test@example.com',
            password: 'Password123',
        };

        // Act
        const response = await request(app)
            .post('/api/v1/auth/register')
            .send(input);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            verificationEmailSent: true,
            user: {
                email: input.email,
                isEmailVerified: false,
            },
        });
        expect(response.body.user.id).toBeDefined();
        expect(response.body.user.passwordHash).toBeUndefined();
        expect(response.body.user.emailVerificationTokenHash).toBeUndefined();

        const createdUser = await User.findOne({email: input.email}).select(
            '+passwordHash +emailVerificationTokenHash',
        );

        expect(createdUser).not.toBeNull();
        expect(createdUser?.passwordHash).not.toBe(input.password);
        expect(createdUser?.emailVerificationTokenHash).toBeDefined();
    });

    it('should return 409 when email is already registered', async () => {
        const input = {
            email: 'duplicate@example.com',
            password: 'Password123',
        };

        await request(app).post('/api/v1/auth/register').send(input);

        const response = await request(app)
            .post('/api/v1/auth/register')
            .send(input);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe(
            'An account with this email already exists',
        );
    });
});
