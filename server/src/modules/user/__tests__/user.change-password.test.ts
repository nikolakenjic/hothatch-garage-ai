import bcrypt from 'bcryptjs';
import request from 'supertest';
import {afterEach, beforeAll, describe, expect, it, vi} from 'vitest';
import app from '../../../app';
import {hashToken, signAccessToken} from '../../../utils/token';
import {Session} from '../../auth/session.model';
import {User} from '../../auth/user.model';
import {changePasswordService} from '../user.service';

vi.mock('../../../utils/email/email.service', () => ({
    sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
    sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}));

const currentPassword = 'CurrentPassword123!';
const newPassword = 'UpdatedPassword456!';
const resetToken = 'previously-issued-reset-token';
let currentPasswordHash: string;

beforeAll(async () => {
    currentPasswordHash = await bcrypt.hash(currentPassword, 4);
});

afterEach(() => {
    vi.restoreAllMocks();
});

const createPasswordUser = async (withResetToken = true) => {
    const resetExpires = new Date(Date.now() + 300_000);
    const user = await User.create({
        email: 'password-change@example.com',
        passwordHash: currentPasswordHash,
        isEmailVerified: true,
        ...(withResetToken && {
            passwordResetTokenHash: hashToken(resetToken),
            passwordResetExpires: resetExpires,
        }),
    });
    await Session.create({
        user: user._id,
        refreshTokenHash: hashToken('existing-refresh-token'),
        expiresAt: new Date(Date.now() + 3_600_000),
    });
    return {user, resetExpires, accessToken: signAccessToken(user._id.toString())};
};

const getPasswordUser = () =>
    User.findOne({email: 'password-change@example.com'}).select(
        '+passwordHash +passwordResetTokenHash +passwordResetExpires',
    );

describe('password changes and outstanding reset links', () => {
    it('invalidates an existing reset link when the authenticated user changes their password', async () => {
        const {user, accessToken} = await createPasswordUser();

        const response = await request(app)
            .patch('/api/v1/users/me/password')
            .set('Cookie', 'accessToken=' + accessToken)
            .send({currentPassword, newPassword});

        expect(response.status).toBe(200);
        const saved = await getPasswordUser();
        expect(await bcrypt.compare(newPassword, saved!.passwordHash!)).toBe(true);
        expect(await bcrypt.compare(currentPassword, saved!.passwordHash!)).toBe(false);
        expect(await Session.countDocuments({user: user._id})).toBe(0);

        const oldResetLink = await request(app)
            .post('/api/v1/auth/reset-password')
            .send({token: resetToken, newPassword: 'AnotherPassword789!'});

        expect(oldResetLink.status).toBe(400);
        expect(oldResetLink.body.message).toBe('Invalid or expired reset token');
        const afterResetAttempt = await getPasswordUser();
        expect(afterResetAttempt?.passwordHash).toBe(saved?.passwordHash);
        expect(saved?.passwordResetTokenHash).toBeUndefined();
        expect(saved?.passwordResetExpires).toBeUndefined();
    });

    it('preserves the reset link, password and sessions when the current password is incorrect', async () => {
        const {user, accessToken, resetExpires} = await createPasswordUser();

        const response = await request(app)
            .patch('/api/v1/users/me/password')
            .set('Cookie', 'accessToken=' + accessToken)
            .send({currentPassword: 'WrongPassword123!', newPassword});

        expect(response.status).toBe(401);
        const saved = await getPasswordUser();
        expect(saved?.passwordHash).toBe(currentPasswordHash);
        expect(saved?.passwordResetTokenHash).toBe(hashToken(resetToken));
        expect(saved?.passwordResetExpires?.getTime()).toBe(resetExpires.getTime());
        expect(await Session.countDocuments({user: user._id})).toBe(1);
    });

    it('rolls back reset-link invalidation if revoking sessions fails', async () => {
        const {user, resetExpires} = await createPasswordUser();
        const deleteSessions = vi.spyOn(Session, 'deleteMany').mockImplementationOnce(() => {
            throw new Error('Simulated session deletion failure');
        });

        await expect(changePasswordService(user._id.toString(), {
            currentPassword,
            newPassword,
        })).rejects.toThrow('Simulated session deletion failure');

        const saved = await getPasswordUser();
        expect(saved?.passwordHash).toBe(currentPasswordHash);
        expect(saved?.passwordResetTokenHash).toBe(hashToken(resetToken));
        expect(saved?.passwordResetExpires?.getTime()).toBe(resetExpires.getTime());
        expect(await Session.countDocuments({user: user._id})).toBe(1);

        deleteSessions.mockRestore();
        await changePasswordService(user._id.toString(), {currentPassword, newPassword});
        const retried = await getPasswordUser();
        expect(await bcrypt.compare(newPassword, retried!.passwordHash!)).toBe(true);
        expect(retried?.passwordResetTokenHash).toBeUndefined();
        expect(retried?.passwordResetExpires).toBeUndefined();
        expect(await Session.countDocuments({user: user._id})).toBe(0);
    });

    it('still changes the password when no reset link has been issued', async () => {
        const {user, accessToken} = await createPasswordUser(false);

        const response = await request(app)
            .patch('/api/v1/users/me/password')
            .set('Cookie', 'accessToken=' + accessToken)
            .send({currentPassword, newPassword});

        expect(response.status).toBe(200);
        const saved = await getPasswordUser();
        expect(await bcrypt.compare(newPassword, saved!.passwordHash!)).toBe(true);
        expect(saved?.passwordResetTokenHash).toBeUndefined();
        expect(saved?.passwordResetExpires).toBeUndefined();
        expect(await Session.countDocuments({user: user._id})).toBe(0);
    });
});
