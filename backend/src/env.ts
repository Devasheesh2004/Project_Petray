import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface Env {
    GOOGLE_API_KEY: string;
    GEMINI_MODEL: string;
    MODEL_PROVIDER: string;
    MONGODB_URI?: string;
    JWT_SECRET: string;
    PORT: number;
}

const getEnv = (): Env => {
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error('GOOGLE_API_KEY is not set in environment variables');
    }

    return {
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite',
        MODEL_PROVIDER: process.env.MODEL_PROVIDER || 'gemini',
        MONGODB_URI: process.env.MONGODB_URI,
        JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only',
        PORT: parseInt(process.env.PORT || '3001', 10),
    };
};

export const env = getEnv();
