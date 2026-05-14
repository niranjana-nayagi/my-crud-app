const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is logged in
exports.protect = async (req, res, next) => {
  try {
    // Get token from HTTP-only cookie (more secure than Authorization header)
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated. Please log in.' });
    }

    // Verify the token is real and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database (to get fresh data)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    // Attach the user to the request so route handlers can access it
    req.user = user;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware factory to restrict access by role
// Usage: restrictTo('admin', 'manager')
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action.'
      });
    }
    next();
  };
};