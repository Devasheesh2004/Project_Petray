import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { env } from '../env';

const seedAdmin = async () => {
    try {
        let uri = env.MONGODB_URI;
        if (!uri) {
            console.error('MONGODB_URI is not set. Cannot seed admin user.');
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists. Exiting...');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin@321', 10);
        const adminUser = new User({
            username: 'admin',
            password: hashedPassword,
            isAdmin: true,
        });

        await adminUser.save();
        console.log('Admin user created successfully: admin / admin@321');
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
