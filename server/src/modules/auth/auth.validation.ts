import {z} from 'zod';

const emailSchema = z.string().email('Invalid email address');

const passwordSchema = z
    .string()
    .min(6, 'Password must be at least 6 characters');

const loginPasswordSchema = z.string().min(1, 'Password is required');

export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export const loginSchema = z.object({
    email: emailSchema,
    password: loginPasswordSchema,
});
