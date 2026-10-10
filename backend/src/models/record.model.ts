import mongoose, { Document, Schema } from 'mongoose';

export type RecordAccess = 'ALL' | 'ADMIN_ONLY';

export interface IRecord extends Document {
  recordId: string;
  title: string;
  category: string;
  description: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED';
  access: RecordAccess;
  createdAt: Date;
  updatedAt: Date;
}

const recordSchema = new Schema<IRecord>(
  {
    recordId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'PENDING', 'COMPLETED'],
      default: 'ACTIVE',
      required: true
    },

    access: {
      type: String,
      enum: ['ALL', 'ADMIN_ONLY'],
      default: 'ALL',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Record = mongoose.model<IRecord>(
  'Record',
  recordSchema
);