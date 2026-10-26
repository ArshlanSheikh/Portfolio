import jwt from 'jsonwebtoken';
import AdminUser from './auth.model.js';

export const authenticateAdmin = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check HttpOnly cookie
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    // 2. Check Authorization Bearer header fallback
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in.',
        data: null,
        error: 'No authentication token provided',
      });
    }

    const secret = process.env.JWT_SECRET || 'supersecretjwtkey_portfolio_cms_change_in_production';
    const decoded = jwt.verify(token, secret);

    const user = await AdminUser.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or session expired.',
        data: null,
        error: 'User associated with token no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please sign in again.',
      data: null,
      error: error.message,
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions.',
        data: null,
        error: 'Forbidden access',
      });
    }
    next();
  };
};
