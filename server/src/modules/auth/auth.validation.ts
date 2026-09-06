import {z} from 'zod';
import {passwordPolicySchema} from '../../validations/common.validation';

const emailSchema = z
    .string({error: 'Email is required'})
    .trim()
    .min(1, 'Email is required')
    .max(254, 'Email is too long')
    .email('Invalid email address')
    .toLowerCase();

const loginPasswordSchema = z
    .string({error: 'Password is required'})
    .min(1, 'Password is required');

export const registerSchema = z.object({
    email: emailSchema,
    password: passwordPolicySchema,
});

export const loginSchema = z.object({
    email: emailSchema,
    password: loginPasswordSchema,
});

const tokenSchema = z
    .string({error: 'Token is required'})
    .min(1, 'Token is required')
    .max(512, 'Invalid token');

export const verifyEmailSchema = z.object({
    token: tokenSchema,
});

export const resendVerificationSchema = z.object({
    email: emailSchema,
});

export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

export const resetPasswordSchema = z.object({
    token: tokenSchema,
    newPassword: passwordPolicySchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
