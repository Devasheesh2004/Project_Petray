import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
    userId: mongoose.Types.ObjectId;
    query: string;
    response: string;
    rating?: number; // 1 for helpful, 0 for not helpful, or whatever scale
    createdAt: Date;
}

const ConversationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    query: { type: String, required: true },
    response: { type: String, required: true },
    rating: { type: Number, required: false },
    createdAt: { type: Date, default: Date.now }
});

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
