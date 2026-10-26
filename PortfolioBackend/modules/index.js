import express from 'express';
import authRoutes from './auth/auth.routes.js';
import profileRoutes from './profile/profile.routes.js';
import skillRoutes from './skills/skill.routes.js';
import experienceRoutes from './experience/experience.routes.js';
import projectRoutes from './projects/project.routes.js';
import serviceRoutes from './services/service.routes.js';
import educationRoutes from './education/education.routes.js';
import dashboardRoutes from './dashboard/dashboard.routes.js';

const router = express.Router();

// Mount feature routers
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/skills', skillRoutes);
router.use('/experience', experienceRoutes);
router.use('/projects', projectRoutes);
router.use('/services', serviceRoutes);
router.use('/education', educationRoutes);
router.use('/dashboard', dashboardRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio CMS API is healthy and operational.',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    error: null,
  });
});

export default router;
