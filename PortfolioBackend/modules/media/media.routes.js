import express from 'express';
import {
  uploadMedia,
  uploadResume,
  getPublicResume,
  getAllMedia,
  deleteMedia,
} from './media.controller.js';
import { authenticateAdmin } from '../auth/auth.middleware.js';
import { upload } from '../../config/cloudinary.js';

const router = express.Router();

// Public route to view or download active resume
router.get('/resume', getPublicResume);

// Admin routes
router.post('/upload', authenticateAdmin, upload.single('file'), uploadMedia);
router.post('/resume', authenticateAdmin, upload.single('resume'), uploadResume);
router.get('/', authenticateAdmin, getAllMedia);
router.delete('/:id', authenticateAdmin, deleteMedia);

export default router;
