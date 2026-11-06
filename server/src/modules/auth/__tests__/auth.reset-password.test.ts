import bcrypt from 'bcryptjs';
import request from 'supertest';
import {afterEach, beforeAll, describe, expect, it, vi} from 'vitest';
import app from '../../../app';
import {hashToken} from '../../../utils/token';
import {resetPasswordService} from '../auth.service';
import {Session} from '../session.model';
import {User} from '../user.model';

vi.mock('../../../utils/email/email.service', () => ({
    sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
    sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}));

const oldPassword = 'OldPassword123!';
const newPassword = 'NewPassword456!';
const resetToken = 'test-reset-token';
let oldPasswordHash: string;

beforeAll(async () => {
    oldPasswordHash = await bcrypt.hash(oldPassword, 4);
});

afterEach(() => {
    vi.restoreAllMocks();
});

const createResetUser = async (expiresAt = new Date(Date.now() + 60_000)) => {
    const user = await User.create({
        email: 'reset@example.com',
        passwordHash: oldPasswordHash,
        isEmailVerified: true,
        passwordResetTokenHash: hashToken(resetToken),
        passwordResetExpires: expiresAt,
    });
    await Session.create({
        user: user._id,
        refreshTokenHash: hashToken('existing-refresh-token'),
        expiresAt: new Date(Date.now() + 60_000),
    });
    return user;
};

const getResetUser = () =>
    User.findOne({email: 'reset@example.com'}).select(
        '+passwordHash +passwordResetTokenHash +passwordResetExpires',
    );

describe('password reset', () => {
    it('changes the password, consumes the token and revokes only that user sessions', async () => {
        const user = await createResetUser();
        const otherUser = await User.create({
            email: 'other@example.com',
            passwordHash: oldPasswordHash,
        });
        await Session.create({
            user: otherUser._id,
            refreshTokenHash: hashToken('other-refresh-token'),
            expiresAt: new Date(Date.now() + 60_000),
        });

        const response = await request(app)
            .post('/api/v1/auth/reset-password')
            .send({token: resetToken, newPassword});

        expect(response.status).toBe(200);
        const saved = await getResetUser();
        expect(saved?.passwordHash).toBeDefined();
        expect(saved?.passwordHash).not.toBe(newPassword);
        expect(await bcrypt.compare(newPassword, saved!.passwordHash!)).toBe(true);
        expect(await bcrypt.compare(oldPassword, saved!.passwordHash!)).toBe(false);
        expect(saved?.passwordResetTokenHash).toBeUndefined();
        expect(saved?.passwordResetExpires).toBeUndefined();
        expect(await Session.countDocuments({user: user._id})).toBe(0);
        expect(await Session.countDocuments({user: otherUser._id})).toBe(1);

        const replay = await request(app)
            .post('/api/v1/auth/reset-password')
            .send({token: resetToken, newPassword: oldPassword});
        expect(replay.status).toBe(400);
        const afterReplay = await getResetUser();
        expect(afterReplay?.passwordHash).toBe(saved?.passwordHash);
    });

    it.each([
        {name: 'invalid', token: 'wrong-token', expiresAt: new Date(Date.now() + 60_000)},
        {name: 'expired', token: resetToken, expiresAt: new Date(Date.now() - 60_000)},
    ])('rejects an $name token without changing the password or sessions', async ({token, expiresAt}) => {
        const user = await createResetUser(expiresAt);

        const response = await request(app)
            .post('/api/v1/auth/reset-password')
            .send({token, newPassword});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid or expired reset token');
        const saved = await getResetUser();
        expect(saved?.passwordHash).toBe(oldPasswordHash);
        expect(saved?.passwordResetTokenHash).toBe(hashToken(resetToken));
        expect(await Session.countDocuments({user: user._id})).toBe(1);
    });

    it('accepts only one of two concurrent requests using the same token', async () => {
        const user = await createResetUser();
        const passwords = ['FirstPassword123!', 'SecondPassword456!'];

        const responses = await Promise.all(
            passwords.map((password) =>
                request(app)
                    .post('/api/v1/auth/reset-password')
                    .send({token: resetToken, newPassword: password}),
            ),
        );

        expect(responses.map((response) => response.status).sort()).toEqual([200, 400]);
        const winner = responses.findIndex((response) => response.status === 200);
        const loser = 1 - winner;
        const saved = await getResetUser();
        expect(await bcrypt.compare(passwords[winner]!, saved!.passwordHash!)).toBe(true);
        expect(await bcrypt.compare(passwords[loser]!, saved!.passwordHash!)).toBe(false);
        expect(saved?.passwordResetTokenHash).toBeUndefined();
        expect(await Session.countDocuments({user: user._id})).toBe(0);
    });

    it('rolls back the password and token if revoking sessions fails', async () => {
        const user = await createResetUser();
        const deleteSessions = vi.spyOn(Session, 'deleteMany').mockImplementationOnce(() => {
            throw new Error('Simulated session deletion failure');
        });

        await expect(resetPasswordService(resetToken, newPassword)).rejects.toThrow(
            'Simulated session deletion failure',
        );

        const saved = await getResetUser();
        expect(saved?.passwordHash).toBe(oldPasswordHash);
        expect(saved?.passwordResetTokenHash).toBe(hashToken(resetToken));
        expect(saved?.passwordResetExpires?.getTime()).toBeGreaterThan(Date.now());
        expect(await Session.countDocuments({user: user._id})).toBe(1);

        deleteSessions.mockRestore();
        await resetPasswordService(resetToken, newPassword);
        expect(await Session.countDocuments({user: user._id})).toBe(0);
        const retried = await getResetUser();
        expect(await bcrypt.compare(newPassword, retried!.passwordHash!)).toBe(true);
        expect(retried?.passwordResetTokenHash).toBeUndefined();
    });

    it('does not add password authentication to a Google-only account', async () => {
        const user = await User.create({
            email: 'google-only@example.com',
            googleSub: 'test-google-sub',
            isEmailVerified: true,
            passwordResetTokenHash: hashToken(resetToken),
            passwordResetExpires: new Date(Date.now() + 60_000),
        });

        await expect(resetPasswordService(resetToken, newPassword)).rejects.toMatchObject({
            statusCode: 400,
        });
        const saved = await User.findById(user._id).select('+passwordHash +googleSub');
        expect(saved?.passwordHash).toBeUndefined();
        expect(saved?.googleSub).toBe('test-google-sub');
    });
});
