import Education from './education.model.js';

// Dedicated controller: Get Public Education (Published only)
export const getPublicEducation = async (req, res) => {
  try {
    console.log('Hit getPublicEducation api...');
    const educations = await Education.find({ isPublished: true }).sort({
      isCurrent: -1,
      startDate: -1,
    });

    return res.status(200).json({
      success: true,
      message: 'Education records retrieved successfully',
      data: {
        educations,
        total: educations.length,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getPublicEducation', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch public education',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Get Admin Education
export const getAdminEducation = async (req, res) => {
  try {
    console.log('Hit getAdminEducation api...');
    const educations = await Education.find().sort({
      order: 1,
      startDate: -1,
    });

    return res.status(200).json({
      success: true,
      message: 'Admin education records retrieved successfully',
      data: {
        educations,
        total: educations.length,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getAdminEducation', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin education',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Create Education
export const createEducation = async (req, res) => {
  try {
    console.log('Hit createEducation api...');
    const incomingData = req.body;

    const requiredFields = ['institution', 'degree', 'fieldOfStudy', 'startDate'];
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

    const education = new Education(incomingData);
    await education.save();

    return res.status(201).json({
      success: true,
      message: 'Education record created successfully',
      data: {
        education,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle createEducation', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create education record',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Update Education
export const updateEducation = async (req, res) => {
  try {
    console.log('Hit updateEducation api...');
    const { id } = req.params;
    const incomingData = req.body;

    const education = await Education.findByIdAndUpdate(id, incomingData, {
      new: true,
      runValidators: true,
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found',
        data: null,
        error: 'Record does not exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Education record updated successfully',
      data: {
        education,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle updateEducation', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update education record',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Delete Education
export const deleteEducation = async (req, res) => {
  try {
    console.log('Hit deleteEducation api...');
    const { id } = req.params;

    const education = await Education.findByIdAndDelete(id);
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found',
        data: null,
        error: 'Record does not exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Education record deleted successfully',
      data: null,
      error: null,
    });
  } catch (error) {
    console.log('failed to handle deleteEducation', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete education record',
      data: null,
      error: error.message,
    });
  }
};
