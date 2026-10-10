import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/user.model';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication token is required'
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: 'JWT_SECRET is not configured'
      });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      role: UserRole;
    };

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token'
    });
  }
};