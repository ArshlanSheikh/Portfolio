import Project from './project.model.js';

// Helper: Generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Dedicated controller: Get Public Projects (Published Only)
export const getPublicProjects = async (req, res) => {
  try {
    console.log('Hit getPublicProjects api...');
    const { category, featured } = req.query;
    const filter = { isPublished: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      data: {
        projects,
        total: projects.length,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getPublicProjects', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch public projects',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Get Single Public Project by Slug
export const getProjectBySlug = async (req, res) => {
  try {
    console.log('Hit getProjectBySlug api...');
    const { slug } = req.params;

    const project = await Project.findOne({ slug: slug.toLowerCase(), isPublished: true });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with slug '${slug}' not found or is not published.`,
        data: null,
        error: 'Project not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: {
        project,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getProjectBySlug', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project details',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Get Admin Projects (All, with search and pagination)
export const getAdminProjects = async (req, res) => {
  try {
    console.log('Hit getAdminProjects api...');
    const { search, category, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { technologies: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (status === 'published') {
      filter.isPublished = true;
    } else if (status === 'draft') {
      filter.isPublished = false;
    }

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Admin projects retrieved successfully',
      data: {
        projects,
        total: projects.length,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getAdminProjects', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin projects',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Get Admin Project by ID
export const getAdminProjectById = async (req, res) => {
  try {
    console.log('Hit getAdminProjectById api...');
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        data: null,
        error: 'Project does not exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: {
        project,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getAdminProjectById', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project by id',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Create Project
export const createProject = async (req, res) => {
  try {
    console.log('Hit createProject api...');
    const incomingData = req.body;

    const requiredFields = ['title', 'summary', 'description'];
    const missingFields = requiredFields.filter((item) => {
      return (
        incomingData[item] === null ||
        incomingData[item] === undefined ||
        incomingData[item] === ''
      );
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing',
        data: null,
        error: missingFields,
      });
    }

    // Generate or clean slug
    let slug = incomingData.slug ? generateSlug(incomingData.slug) : generateSlug(incomingData.title);
    if (!slug) slug = `project-${Date.now()}`;

    // Ensure slug uniqueness
    const existingSlug = await Project.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    incomingData.slug = slug;

    // Handle technologies array if sent as comma-separated string
    if (typeof incomingData.technologies === 'string') {
      incomingData.technologies = incomingData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const project = new Project(incomingData);
    await project.save();

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        project,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle createProject', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create project',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Update Project
export const updateProject = async (req, res) => {
  try {
    console.log('Hit updateProject api...');
    const { id } = req.params;
    const incomingData = req.body;

    // If slug is being updated, verify uniqueness
    if (incomingData.slug) {
      incomingData.slug = generateSlug(incomingData.slug);
      const existing = await Project.findOne({ slug: incomingData.slug, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A project with this slug already exists',
          data: null,
          error: ['slug'],
        });
      }
    }

    // Handle technologies array if string
    if (typeof incomingData.technologies === 'string') {
      incomingData.technologies = incomingData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const project = await Project.findByIdAndUpdate(id, incomingData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        data: null,
        error: 'Project does not exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: {
        project,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle updateProject', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update project',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Delete Project
export const deleteProject = async (req, res) => {
  try {
    console.log('Hit deleteProject api...');
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        data: null,
        error: 'Project does not exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      data: null,
      error: null,
    });
  } catch (error) {
    console.log('failed to handle deleteProject', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      data: null,
      error: error.message,
    });
  }
};
