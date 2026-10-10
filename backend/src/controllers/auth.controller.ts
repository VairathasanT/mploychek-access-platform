import { Request, Response } from 'express';
import { loginUser } from '../services/auth.service';

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, password, role } = req.body;

    if (!userId || !password || !role) {
      res.status(400).json({
        success: false,
        message: 'User ID, password and role are required'
      });
      return;
    }

    if (!['ADMIN', 'GENERAL_USER'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
      return;
    }

    const result = await loginUser({
      userId,
      password,
      role
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Login failed';

    res.status(401).json({
      success: false,
      message
    });
  }
};