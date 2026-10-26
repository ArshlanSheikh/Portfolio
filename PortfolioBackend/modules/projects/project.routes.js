import express from 'express';
import {
  getPublicProjects,
  getProjectBySlug,
  getAdminProjects,
  getAdminProjectById,
  createProject,
  updateProject,
  deleteProject,
} from './project.controller.js';
import { authenticateAdmin } from '../auth/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getPublicProjects);
router.get('/detail/:slug', getProjectBySlug);

// Admin routes
router.get('/admin', authenticateAdmin, getAdminProjects);
router.get('/admin/:id', authenticateAdmin, getAdminProjectById);
router.post('/admin', authenticateAdmin, createProject);
router.put('/admin/:id', authenticateAdmin, updateProject);
router.delete('/admin/:id', authenticateAdmin, deleteProject);

export default router;
