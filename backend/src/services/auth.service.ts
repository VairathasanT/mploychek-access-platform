import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByUserId } from './user.service';
import { UserRole } from '../models/user.model';

interface LoginInput {
  userId: string;
  password: string;
  role: UserRole;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    userId: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export const loginUser = async (
  data: LoginInput
): Promise<LoginResponse> => {
  const user = await findUserByUserId(data.userId);

  if (!user) {
    throw new Error('Invalid User ID or password');
  }

  const passwordMatch = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error('Invalid User ID or password');
  }

  if (user.role !== data.role) {
    throw new Error('Selected role does not match your account');
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const token = jwt.sign(
    {
      userId: user.userId,
      role: user.role
    },
    jwtSecret,
    {
      expiresIn: '1d'
    }
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};