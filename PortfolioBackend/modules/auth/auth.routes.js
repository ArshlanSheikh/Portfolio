import express from 'express';
import {
  loginAdmin,
  logoutAdmin,
  getMe,
  changePassword,
} from './auth.controller.js';
import { authenticateAdmin } from './auth.middleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', authenticateAdmin, getMe);
router.put('/change-password', authenticateAdmin, changePassword);

export default router;
