import dotenv from 'dotenv';
import {z} from 'zod';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: z.coerce.number().int().positive().default(5001),

    MONGO_URI: z.string().min(1, 'MONGO_URI is required'),

    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_REFRESH_SECRET: z
        .string()
        .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),

    GROQ_API_KEY: z.string().min(1, 'GROQ_API_KEY is required'),
    RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),

    CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL'),
    EMAIL_FROM: z.string().email('EMAIL_FROM must be a valid email address'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables — check the log above');
}

export const env = parsed.data;
