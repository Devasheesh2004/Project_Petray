import { Router, Response } from 'express';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Conversation } from '../models/Conversation';

export const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.get('/stats', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const totalUsers = await User.countDocuments({ isAdmin: false });
        const feedbacks = await Conversation.find({ rating: { $exists: true } })
            .populate('userId', 'username')
            .sort({ createdAt: -1 });

        res.json({
            totalUsers,
            feedbacks,
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
});
