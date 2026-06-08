import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Conversation } from '../models/Conversation';
import { getChatModel } from '../model_provider';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export const chatRouter = Router();

chatRouter.use(authenticate);

chatRouter.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { message } = req.body;
        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }

        const model = getChatModel({ temperature: 0.7 });
        const messages = [
            new SystemMessage('You are a helpful customer support assistant.'),
            new HumanMessage(message),
        ];

        const aiResponse = await model.invoke(messages);
        const responseText = aiResponse.content.toString();

        const conversation = new Conversation({
            userId: req.user._id,
            query: message,
            response: responseText,
        });

        await conversation.save();

        res.json({
            id: conversation._id,
            response: responseText,
        });
    } catch (error: any) {
        console.error('Error processing chat:', error);

        // Check for specific Google API high demand error (503)
        const errorMessage = error?.message || '';
        const apiError = error?.response?.data?.error;
        
        if (
            error?.status === 503 || 
            apiError?.code === 503 || 
            errorMessage.includes('high demand')
        ) {
            res.status(503).json({ error: 'The customer support is experiencing high demand. Please try again later' });
            return;
        }

        res.status(500).json({ error: 'Failed to process chat' });
    }
});

chatRouter.get('/history', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const history = await Conversation.find({ userId: req.user._id }).sort({ createdAt: 1 });
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

chatRouter.post('/rating', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { conversationId, rating } = req.body;
        if (!conversationId || typeof rating !== 'number') {
            res.status(400).json({ error: 'conversationId and rating are required' });
            return;
        }

        const conversation = await Conversation.findOneAndUpdate(
            { _id: conversationId, userId: req.user._id },
            { rating },
            { new: true }
        );

        if (!conversation) {
            res.status(404).json({ error: 'Conversation not found or unauthorized' });
            return;
        }

        res.json(conversation);
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).json({ error: 'Failed to update rating' });
    }
});
