import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env';

import { authRouter } from './routes/auth';
import { chatRouter } from './routes/chat';
import { adminRouter } from './routes/admin';

const app = express();
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/admin', adminRouter);

// Database and Server Start
const startServer = async () => {
    try {
        let uri = env.MONGODB_URI;

        if (!uri) {
            console.log('No MONGODB_URI found in environment, starting an in-memory database...');
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
        }

        await mongoose.connect(uri);
        console.log(`Connected to MongoDB`);

        app.listen(env.PORT, () => {
            console.log(`Server is running on PORT: ${env.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
};

startServer();
