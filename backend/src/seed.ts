import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { createUser } from './services/user.service';

dotenv.config();

const seedUsers = async (): Promise<void> => {
  try {
    await connectDatabase();

    await createUser({
      userId: 'ADM001',
      name: 'System Administrator',
      email: 'admin@mploychek.com',
      password: 'Admin@12345',
      role: 'ADMIN'
    });

    await createUser({
      userId: 'USR001',
      name: 'General User',
      email: 'user@mploychek.com',
      password: 'User@12345',
      role: 'GENERAL_USER'
    });

    console.log('Initial users created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedUsers();