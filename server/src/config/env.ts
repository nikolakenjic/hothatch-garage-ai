import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = [
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'GROQ_API_KEY',
    'RESEND_API_KEY',
    'CLIENT_URL',
    'EMAIL_FROM',
];

for (const variable of requiredEnv) {
    if (!process.env[variable]) {
        throw new Error(`${variable} is missing`);
    }
}

export const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || '5001',
    MONGO_URI: process.env.MONGO_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    GROQ_API_KEY: process.env.GROQ_API_KEY!,
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    CLIENT_URL: process.env.CLIENT_URL!,
    EMAIL_FROM: process.env.EMAIL_FROM!,
};
