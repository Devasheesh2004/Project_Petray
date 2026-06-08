import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password?: string;
    isAdmin: boolean;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String }, // optional because maybe they will use social login later
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', UserSchema);
