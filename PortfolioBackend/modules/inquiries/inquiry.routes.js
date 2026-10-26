import express from 'express';
import { rateLimit } from 'express-rate-limit';
import {
  createInquiry,
  getAdminInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
} from './inquiry.controller.js';
import { authenticateAdmin } from '../auth/auth.middleware.js';

const router = express.Router();

// Rate limiter for public contact submissions: 10 inquiries per 15 minutes
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many inquiries submitted from this IP. Please wait a while before sending another message.',
    data: null,
    error: 'Rate limit exceeded',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public submission route
router.post('/', inquiryLimiter, createInquiry);

// Admin routes
router.get('/admin', authenticateAdmin, getAdminInquiries);
router.get('/admin/:id', authenticateAdmin, getInquiryById);
router.put('/admin/:id/status', authenticateAdmin, updateInquiryStatus);
router.delete('/admin/:id', authenticateAdmin, deleteInquiry);

export default router;
