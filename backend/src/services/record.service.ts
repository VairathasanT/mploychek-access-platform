import { Record, IRecord } from '../models/record.model';

export const getAccessibleRecords = async (
  role: 'ADMIN' | 'GENERAL_USER'
): Promise<IRecord[]> => {
  if (role === 'ADMIN') {
    // Admin can see all records.
    return Record.find().sort({ createdAt: -1 });
  }

  // General users can only see records marked as ALL.
  return Record.find({
    access: 'ALL'
  }).sort({ createdAt: -1 });
};

export const getRecordById = async (
  recordId: string,
  role: 'ADMIN' | 'GENERAL_USER'
): Promise<IRecord | null> => {
  const record = await Record.findOne({ recordId });

  if (!record) {
    return null;
  }

  if (record.access === 'ADMIN_ONLY' && role !== 'ADMIN') {
    return null;
  }

  return record;
};

export const createRecord = async (
  data: {
    recordId: string;
    title: string;
    category: string;
    description: string;
    status?: 'ACTIVE' | 'PENDING' | 'COMPLETED';
    access?: 'ALL' | 'ADMIN_ONLY';
  }
): Promise<IRecord> => {
  return Record.create(data);
};