import express from 'express';
import {
  getPublicProfile,
  getAdminProfile,
  updateProfile,
} from './profile.controller.js';
import { authenticateAdmin } from '../auth/auth.middleware.js';

const router = express.Router();

// Public route
router.get('/', getPublicProfile);

// Admin routes
router.get('/admin', authenticateAdmin, getAdminProfile);
router.put('/admin', authenticateAdmin, updateProfile);

export default router;
