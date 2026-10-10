export type RecordStatus = 'ACTIVE' | 'PENDING' | 'COMPLETED';
export type RecordAccess = 'ALL' | 'ADMIN_ONLY';

export interface Record {
  _id: string;
  recordId: string;
  title: string;
  category: string;
  description: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED';
  access: 'ALL' | 'ADMIN_ONLY';
  createdAt: string;
  updatedAt: string;
}

export interface RecordsResponse {
  success: boolean;
  message: string;
  meta: {
    role: 'ADMIN' | 'GENERAL_USER';
    delay: number;
    count: number;
  };
  data: Record[];
}