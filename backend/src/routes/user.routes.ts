import { Router } from 'express';
import {
  getUsers,
  addUser,
  editUser,
  removeUser
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

// All user-management endpoints require authentication + ADMIN role.
router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  getUsers
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  addUser
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  editUser
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  removeUser
);

export default router;