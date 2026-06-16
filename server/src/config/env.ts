import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'GROQ_API_KEY'];

for (const variable of requiredEnv) {
    if (!process.env[variable]) {
        throw new Error(`${variable} is missing`);
    }
}

export const env = {
    PORT: process.env.PORT || '5001',
    MONGO_URI: process.env.MONGO_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    GROQ_API_KEY: process.env.GROQ_API_KEY!,
};
