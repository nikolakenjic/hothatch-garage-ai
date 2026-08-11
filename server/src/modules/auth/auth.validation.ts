import {z} from 'zod';

const emailSchema = z
    .string({error: 'Email is required'})
    .trim()
    .min(1, 'Email is required')
    .max(254, 'Email is too long')
    .email('Invalid email address')
    .toLowerCase();

const newPasswordSchema = z
    .string({error: 'Password is required'})
    .min(8, 'Password must be at least 8 characters')
    .refine(
        (password) => Buffer.byteLength(password, 'utf8') <= 72,
        'Password must not exceed 72 bytes',
    );

const loginPasswordSchema = z
    .string({error: 'Password is required'})
    .min(1, 'Password is required');

export const registerSchema = z.object({
    email: emailSchema,
    password: newPasswordSchema,
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
    newPassword: newPasswordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
