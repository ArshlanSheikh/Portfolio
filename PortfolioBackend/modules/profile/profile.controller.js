import Profile from './profile.model.js';

// Dedicated controller: Get Public Profile
export const getPublicProfile = async (req, res) => {
  try {
    console.log('Hit getPublicProfile api...');
    let profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile information not found',
        data: null,
        error: 'Profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        profile,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getPublicProfile', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch public profile',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    console.log('Hit getAdminProfile api...');
    let profile = await Profile.findOne();
    if (!profile) {
      // Create empty profile if none exists
      profile = await Profile.create({
        fullName: 'Developer Name',
        title: 'Full Stack Developer',
        bio: 'Professional Bio',
        email: 'developer@example.com',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Admin profile retrieved successfully',
      data: {
        profile,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getAdminProfile', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Update Profile
export const updateProfile = async (req, res) => {
  try {
    console.log('Hit updateProfile api...');
    const incomingData = req.body;

    const requiredFields = ['fullName', 'title', 'bio', 'email'];
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

    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(incomingData);
    } else {
      Object.assign(profile, incomingData);
    }

    await profile.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle updateProfile', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      data: null,
      error: error.message,
    });
  }
};
