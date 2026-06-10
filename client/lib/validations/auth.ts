import {z} from 'zod';

const emailField = z.string().email('Invalid email');
const passwordField = z
    .string()
    .min(6, 'Password must be at least 6 characters');

export const loginSchema = z.object({
    email: emailField,
    password: passwordField,
});

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: emailField,
    password: passwordField,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
