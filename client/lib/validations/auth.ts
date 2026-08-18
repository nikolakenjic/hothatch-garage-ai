import {z} from 'zod';

const loginPasswordSchema = z.string().min(1, 'Password is required');

const passwordPolicySchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must not exceed 72 characters')
    .refine(
        (password) => new TextEncoder().encode(password).length <= 72,
        'Password must not exceed 72 bytes',
    )
    .refine(
        (password) => /[a-z]/.test(password),
        'Password must contain at least one lowercase letter',
    )
    .refine(
        (password) => /[A-Z]/.test(password),
        'Password must contain at least one uppercase letter',
    )
    .refine(
        (password) => /[0-9]/.test(password),
        'Password must contain at least one number',
    );

const emailField = z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(254, 'Email is too long')
    .email('Invalid email')
    .toLowerCase();

export const loginSchema = z.object({
    email: emailField,
    password: loginPasswordSchema,
});

export const registerSchema = z.object({
    email: emailField,
    password: passwordPolicySchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
