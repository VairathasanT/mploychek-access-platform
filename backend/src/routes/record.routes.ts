import { Router } from 'express';
import {
  addRecord,
  getRecord,
  getRecords
} from '../controllers/record.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

router.get(
  '/',
  authenticate,
  getRecords
);

router.get(
  '/:recordId',
  authenticate,
  getRecord
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  addRecord
);

export default router;