import express from 'express';
import {
  getPublicSkills,
  getAdminSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from './skill.controller.js';
import { authenticateAdmin } from '../auth/auth.middleware.js';

const router = express.Router();

// Public route
router.get('/', getPublicSkills);

// Admin routes
router.get('/admin', authenticateAdmin, getAdminSkills);
router.post('/admin', authenticateAdmin, createSkill);
router.put('/admin/:id', authenticateAdmin, updateSkill);
router.delete('/admin/:id', authenticateAdmin, deleteSkill);

export default router;
