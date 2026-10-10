import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { Record } from './models/record.model';

dotenv.config();

const seedRecords = async (): Promise<void> => {
  try {
    await connectDatabase();

    await Record.deleteMany({});

    await Record.insertMany([
      {
        recordId: 'REC001',
        title: 'Employee Verification',
        category: 'Identity',
        description: 'Employee identity verification record.',
        status: 'ACTIVE',
        access: 'ALL'
      },
      {
        recordId: 'REC002',
        title: 'Employment Eligibility',
        category: 'Compliance',
        description: 'Employment eligibility verification record.',
        status: 'PENDING',
        access: 'ALL'
      },
      {
        recordId: 'REC003',
        title: 'Administrative Audit',
        category: 'Security',
        description: 'Restricted administrative audit information.',
        status: 'COMPLETED',
        access: 'ADMIN_ONLY'
      },
      {
        recordId: 'REC004',
        title: 'Background Verification',
        category: 'Verification',
        description: 'Background verification status record.',
        status: 'ACTIVE',
        access: 'ALL'
      }
    ]);

    console.log('Demo records created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Record seed failed:', error);
    process.exit(1);
  }
};

seedRecords();