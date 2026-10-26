import AdminUser from './auth.model.js';

// Dedicated controller: Admin Login
export const loginAdmin = async (req, res) => {
  try {
    console.log('Hit loginAdmin api...');
    const incomingData = req.body;

    const requiredFields = ['email', 'password'];
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

    const { email, password } = incomingData;

    // Find admin user including password field for verification
    const user = await AdminUser.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null,
        error: 'Authentication failed',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null,
        error: 'Authentication failed',
      });
    }

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    // Configure cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie('accessToken', token, cookieOptions);

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: safeUser,
        token,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle loginAdmin', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Admin Logout
export const logoutAdmin = async (req, res) => {
  try {
    console.log('Hit logoutAdmin api...');
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      data: null,
      error: null,
    });
  } catch (error) {
    console.log('failed to handle logoutAdmin', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to logout admin',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Get Current Admin
export const getMe = async (req, res) => {
  try {
    console.log('Hit getMe api...');
    return res.status(200).json({
      success: true,
      message: 'Authenticated admin profile retrieved',
      data: {
        user: req.user,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getMe', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Change Password
export const changePassword = async (req, res) => {
  try {
    console.log('Hit changePassword api...');
    const incomingData = req.body;

    const requiredFields = ['currentPassword', 'newPassword'];
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

    const { currentPassword, newPassword } = incomingData;

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
        data: null,
        error: ['newPassword'],
      });
    }

    const user = await AdminUser.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found',
        data: null,
        error: 'User not found',
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
        data: null,
        error: ['currentPassword'],
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      data: null,
      error: null,
    });
  } catch (error) {
    console.log('failed to handle changePassword', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password',
      data: null,
      error: error.message,
    });
  }
};
