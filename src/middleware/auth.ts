import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
  userPremium?: boolean;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; isPremium: boolean };
    req.userId = decoded.userId;
    req.userPremium = decoded.isPremium;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requirePremium = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.userPremium) {
    return res.status(403).json({ error: 'Premium subscription required' });
  }
  next();
};
