import Project from '../projects/project.model.js';
import Skill from '../skills/skill.model.js';
import Experience from '../experience/experience.model.js';
import Service from '../services/service.model.js';
import Education from '../education/education.model.js';
import Inquiry from '../inquiries/inquiry.model.js';
import BlogPost from '../blog/blog.model.js';

// Dedicated controller: Get Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    console.log('Hit getDashboardStats api...');

    const [
      totalProjects,
      publishedProjects,
      totalSkills,
      totalServices,
      totalExperience,
      totalEducation,
      totalPosts,
      totalInquiries,
      unreadInquiries,
      recentProjects,
      recentInquiries,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ isPublished: true }),
      Skill.countDocuments(),
      Service.countDocuments(),
      Experience.countDocuments(),
      Education.countDocuments(),
      BlogPost.countDocuments(),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ isRead: false }),
      Project.find().sort({ createdAt: -1 }).limit(4).select('title technologies isPublished isFeatured thumbnail'),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).select('name email subject status createdAt'),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        metrics: {
          totalProjects,
          publishedProjects,
          draftProjects: totalProjects - publishedProjects,
          totalSkills,
          totalServices,
          totalExperience,
          totalEducation,
          totalPosts,
          totalInquiries,
          unreadInquiries,
        },
        recentProjects,
        recentInquiries,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getDashboardStats', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      data: null,
      error: error.message,
    });
  }
};
