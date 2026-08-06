import {resend} from './resend.client';
import {env} from '../../config/env';

export const sendVerificationEmail = async (to: string, token: string) => {
    const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;

    await resend.emails.send({
        from: env.EMAIL_FROM,
        to,
        subject: 'Verify your HotHatch Garage account',
        html: `<p>Click below to verify your email:</p><a href="${verifyUrl}">${verifyUrl}</a><p>This link expires in 24 hours.</p>`,
    });
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;

    await resend.emails.send({
        from: env.EMAIL_FROM,
        to,
        subject: 'Reset your HotHatch Garage password',
        html: `<p>Click below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a><p>This link expires in 15 minutes. If you didn't request this, ignore this email.</p>`,
    });
};
