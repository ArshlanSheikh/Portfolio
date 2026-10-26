import express from 'express';
import {
  getPublicEducation,
  getAdminEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from './education.controller.js';
import { authenticateAdmin } from '../auth/auth.middleware.js';

const router = express.Router();

// Public route
router.get('/', getPublicEducation);

// Admin routes
router.get('/admin', authenticateAdmin, getAdminEducation);
router.post('/admin', authenticateAdmin, createEducation);
router.put('/admin/:id', authenticateAdmin, updateEducation);
router.delete('/admin/:id', authenticateAdmin, deleteEducation);

export default router;
