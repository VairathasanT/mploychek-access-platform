import bcrypt from 'bcryptjs';
import { User, IUser, UserRole } from '../models/user.model';

interface CreateUserInput {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const createUser = async (
  data: CreateUserInput
): Promise<IUser> => {
  const existingUser = await User.findOne({
    $or: [
      { userId: data.userId },
      { email: data.email.toLowerCase() }
    ]
  });

  if (existingUser) {
    throw new Error('User ID or email already exists');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    userId: data.userId,
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role
  });

  return user;
};

export const findUserByUserId = async (
  userId: string
): Promise<IUser | null> => {
  return User.findOne({ userId });
};

export const findUserById = async (
  id: string
): Promise<IUser | null> => {
  return User.findById(id);
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return User.find().select('-password').sort({ createdAt: -1 });
};

export const updateUser = async (
  id: string,
  data: Partial<{
    name: string;
    email: string;
    role: UserRole;
  }>
): Promise<IUser | null> => {
  return User.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');
};

export const deleteUser = async (
  id: string
): Promise<IUser | null> => {
  return User.findByIdAndDelete(id).select('-password');
};