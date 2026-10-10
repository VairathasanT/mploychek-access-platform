import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'ADMIN' | 'GENERAL_USER';

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ['ADMIN', 'GENERAL_USER'],
      default: 'GENERAL_USER',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model<IUser>('User', userSchema);