import express from 'express';
import {
  getPublicExperience,
  getAdminExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from './experience.controller.js';
import { authenticateAdmin } from '../auth/auth.middleware.js';

const router = express.Router();

// Public route
router.get('/', getPublicExperience);

// Admin routes
router.get('/admin', authenticateAdmin, getAdminExperience);
router.post('/admin', authenticateAdmin, createExperience);
router.put('/admin/:id', authenticateAdmin, updateExperience);
router.delete('/admin/:id', authenticateAdmin, deleteExperience);

export default router;
