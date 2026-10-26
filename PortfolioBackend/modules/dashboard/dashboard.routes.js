import express from 'express';
import { getDashboardStats } from './dashboard.controller.js';
import { authenticateAdmin } from '../auth/auth.middleware.js';

const router = express.Router();

router.get('/stats', authenticateAdmin, getDashboardStats);

export default router;
