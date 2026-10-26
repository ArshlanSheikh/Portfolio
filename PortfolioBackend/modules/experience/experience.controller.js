import Experience from './experience.model.js';

// Dedicated controller: Get Public Experience (Published only)
export const getPublicExperience = async (req, res) => {
  try {
    console.log('Hit getPublicExperience api...');
    const experiences = await Experience.find({ isPublished: true }).sort({
      isCurrent: -1,
      startDate: -1,
    });

    return res.status(200).json({
      success: true,
      message: 'Experience records retrieved successfully',
      data: {
        experiences,
        total: experiences.length,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getPublicExperience', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch public experience',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Get Admin Experience
export const getAdminExperience = async (req, res) => {
  try {
    console.log('Hit getAdminExperience api...');
    const experiences = await Experience.find().sort({
      order: 1,
      startDate: -1,
    });

    return res.status(200).json({
      success: true,
      message: 'Admin experience records retrieved successfully',
      data: {
        experiences,
        total: experiences.length,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getAdminExperience', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin experience',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Create Experience
export const createExperience = async (req, res) => {
  try {
    console.log('Hit createExperience api...');
    const incomingData = req.body;

    const requiredFields = ['company', 'position', 'startDate'];
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

    const experience = new Experience(incomingData);
    await experience.save();

    return res.status(201).json({
      success: true,
      message: 'Experience record created successfully',
      data: {
        experience,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle createExperience', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create experience record',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Update Experience
export const updateExperience = async (req, res) => {
  try {
    console.log('Hit updateExperience api...');
    const { id } = req.params;
    const incomingData = req.body;

    const experience = await Experience.findByIdAndUpdate(id, incomingData, {
      new: true,
      runValidators: true,
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found',
        data: null,
        error: 'Record does not exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Experience record updated successfully',
      data: {
        experience,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle updateExperience', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update experience record',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Delete Experience
export const deleteExperience = async (req, res) => {
  try {
    console.log('Hit deleteExperience api...');
    const { id } = req.params;

    const experience = await Experience.findByIdAndDelete(id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found',
        data: null,
        error: 'Record does not exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Experience record deleted successfully',
      data: null,
      error: null,
    });
  } catch (error) {
    console.log('failed to handle deleteExperience', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete experience record',
      data: null,
      error: error.message,
    });
  }
};
