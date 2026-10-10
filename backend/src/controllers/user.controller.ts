import { Request, Response } from 'express';
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser
} from '../services/user.service';

export const getUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users'
    });
  }
};

export const addUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      userId,
      name,
      email,
      password,
      role
    } = req.body;

    if (!userId || !name || !email || !password || !role) {
      res.status(400).json({
        success: false,
        message:
          'userId, name, email, password and role are required'
      });
      return;
    }

    if (!['ADMIN', 'GENERAL_USER'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid user role'
      });
      return;
    }

    const user = await createUser({
      userId,
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to create user';

    res.status(400).json({
      success: false,
      message
    });
  }
};

export const editUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      res.status(400).json({
        success: false,
        message: 'Name, email and role are required'
      });
      return;
    }

    if (!['ADMIN', 'GENERAL_USER'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid user role'
      });
      return;
    }

    const user = await updateUser(String(req.params.id), {
      name: name.trim(),
      email: email.trim(),
      role
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);

    res.status(400).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

export const removeUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await deleteUser(String(req.params.id));

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: user
    });
  } catch (error) {
    console.error('Delete user error:', error);

    res.status(400).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};