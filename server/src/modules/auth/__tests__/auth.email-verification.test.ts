import request from 'supertest';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import app from '../../../app';
import {sendVerificationEmail} from '../../../utils/email/email.service';
import {hashToken} from '../../../utils/token';
import {User} from '../user.model';

vi.mock('../../../utils/email/email.service', () => ({
    sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
    sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

const createUnverifiedUser = (expiresAt = new Date(Date.now() + 60_000)) =>
    User.create({
        email: 'verify@example.com',
        passwordHash: 'test-password-hash',
        emailVerificationTokenHash: hashToken('original-token'),
        emailVerificationExpires: expiresAt,
    });

describe('email verification', () => {
    it('verifies the email without exposing or changing authentication fields', async () => {
        await createUnverifiedUser();

        const response = await request(app)
            .post('/api/v1/auth/verify-email')
            .send({token: 'original-token'});

        expect(response.status).toBe(200);
        expect(response.body.user.isEmailVerified).toBe(true);
        for (const field of [
            'passwordHash',
            'googleSub',
            'emailVerificationTokenHash',
            'emailVerificationExpires',
        ]) {
            expect(response.body.user[field]).toBeUndefined();
        }

        const user = await User.findOne({email: 'verify@example.com'}).select(
            '+passwordHash +emailVerificationTokenHash +emailVerificationExpires',
        );
        expect(user?.isEmailVerified).toBe(true);
        expect(user?.passwordHash).toBe('test-password-hash');
        expect(user?.emailVerificationTokenHash).toBeUndefined();
        expect(user?.emailVerificationExpires).toBeUndefined();

        const replay = await request(app)
            .post('/api/v1/auth/verify-email')
            .send({token: 'original-token'});
        expect(replay.status).toBe(400);
    });

    it.each([
        {name: 'invalid', token: 'wrong-token', expiresAt: new Date(Date.now() + 60_000)},
        {name: 'expired', token: 'original-token', expiresAt: new Date(Date.now() - 60_000)},
    ])('rejects an $name token', async ({token, expiresAt}) => {
        await createUnverifiedUser(expiresAt);

        const response = await request(app)
            .post('/api/v1/auth/verify-email')
            .send({token});

        expect(response.status).toBe(400);
        const user = await User.findOne({email: 'verify@example.com'});
        expect(user?.isEmailVerified).toBe(false);
    });

    it('resends a usable link and replaces the old token', async () => {
        await createUnverifiedUser();

        const response = await request(app)
            .post('/api/v1/auth/resend-verification')
            .send({email: 'verify@example.com'});

        expect(response.status).toBe(200);
        const sendEmail = vi.mocked(sendVerificationEmail);
        expect(sendEmail).toHaveBeenCalledTimes(1);
        const [email, token] = sendEmail.mock.calls[0]!;
        expect(email).toBe('verify@example.com');
        expect(token).not.toBe('original-token');

        const user = await User.findOne({email}).select(
            '+passwordHash +emailVerificationTokenHash +emailVerificationExpires',
        );
        expect(user?.passwordHash).toBe('test-password-hash');
        expect(user?.emailVerificationTokenHash).toBe(hashToken(token));
        expect(user?.emailVerificationExpires?.getTime()).toBeGreaterThan(Date.now());

        const oldLink = await request(app)
            .post('/api/v1/auth/verify-email')
            .send({token: 'original-token'});
        expect(oldLink.status).toBe(400);

        const newLink = await request(app)
            .post('/api/v1/auth/verify-email')
            .send({token});
        expect(newLink.status).toBe(200);
    });

    it('does not send another link for a verified user', async () => {
        await User.create({
            email: 'verified@example.com',
            passwordHash: 'test-password-hash',
            isEmailVerified: true,
        });

        const response = await request(app)
            .post('/api/v1/auth/resend-verification')
            .send({email: 'verified@example.com'});

        expect(response.status).toBe(200);
        expect(sendVerificationEmail).not.toHaveBeenCalled();
    });
});

describe('user authentication method validation', () => {
    it('rejects a new user without any authentication method', async () => {
        const user = new User({email: 'missing-auth@example.com'});

        await expect(user.validate()).rejects.toThrow(
            'At least one authentication method is required',
        );
    });

    it('allows unrelated updates when a Google authentication field is not selected', async () => {
        await User.create({
            email: 'google@example.com',
            googleSub: 'test-google-sub',
            isEmailVerified: true,
        });
        const user = await User.findOne({email: 'google@example.com'});
        expect(user).not.toBeNull();
        expect(user?.googleSub).toBeUndefined();
        expect(user?.passwordHash).toBeUndefined();

        user!.displayName = 'Updated name';
        await user!.save();

        const saved = await User.findById(user!._id).select('+googleSub');
        expect(saved?.displayName).toBe('Updated name');
        expect(saved?.googleSub).toBe('test-google-sub');
    });

    it('rejects removing the only authentication method', async () => {
        const created = await User.create({
            email: 'password@example.com',
            passwordHash: 'test-password-hash',
        });
        const user = await User.findById(created._id).select('+passwordHash +googleSub');
        user!.passwordHash = undefined;

        await expect(user!.save()).rejects.toThrow(
            'At least one authentication method is required',
        );
    });
});
