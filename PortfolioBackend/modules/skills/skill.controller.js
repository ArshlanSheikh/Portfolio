import Skill from './skill.model.js';

// Dedicated controller: Get Public Skills (Published Only)
export const getPublicSkills = async (req, res) => {
  try {
    console.log('Hit getPublicSkills api...');
    const skills = await Skill.find({ isPublished: true }).sort({ order: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: 'Skills retrieved successfully',
      data: {
        skills,
        total: skills.length,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getPublicSkills', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch public skills',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Get Admin Skills (All records with filtering)
export const getAdminSkills = async (req, res) => {
  try {
    console.log('Hit getAdminSkills api...');
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const skills = await Skill.find(filter).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Admin skills retrieved successfully',
      data: {
        skills,
        total: skills.length,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getAdminSkills', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin skills',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Create Skill
export const createSkill = async (req, res) => {
  try {
    console.log('Hit createSkill api...');
    const incomingData = req.body;

    const requiredFields = ['name', 'category'];
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

    const skill = new Skill(incomingData);
    await skill.save();

    return res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: {
        skill,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle createSkill', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create skill',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Update Skill
export const updateSkill = async (req, res) => {
  try {
    console.log('Hit updateSkill api...');
    const { id } = req.params;
    const incomingData = req.body;

    const skill = await Skill.findByIdAndUpdate(id, incomingData, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
        data: null,
        error: 'Skill does not exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: {
        skill,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle updateSkill', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update skill',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Delete Skill
export const deleteSkill = async (req, res) => {
  try {
    console.log('Hit deleteSkill api...');
    const { id } = req.params;

    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
        data: null,
        error: 'Skill does not exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
      data: null,
      error: null,
    });
  } catch (error) {
    console.log('failed to handle deleteSkill', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete skill',
      data: null,
      error: error.message,
    });
  }
};
