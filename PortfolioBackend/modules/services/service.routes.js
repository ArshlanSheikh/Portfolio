import express from 'express';
import {
  getPublicServices,
  getAdminServices,
  createService,
  updateService,
  deleteService,
} from './service.controller.js';
import { authenticateAdmin } from '../auth/auth.middleware.js';

const router = express.Router();

// Public route
router.get('/', getPublicServices);

// Admin routes
router.get('/admin', authenticateAdmin, getAdminServices);
router.post('/admin', authenticateAdmin, createService);
router.put('/admin/:id', authenticateAdmin, updateService);
router.delete('/admin/:id', authenticateAdmin, deleteService);

export default router;
