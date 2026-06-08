import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env';
import { User } from '../models/User';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as any;
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || !req.user.isAdmin) {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }
    next();
};
