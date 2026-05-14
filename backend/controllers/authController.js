const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Helper function to create a JWT and send it as a cookie
const sendTokenCookie = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }  // token expires in 1 day
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true,    // Cannot be accessed by JavaScript — prevents XSS
    secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
    sameSite: 'strict' // Prevents CSRF attacks
  };

  // Send cookie in response
  res.cookie('jwt', token, cookieOptions);

  // Remove password from the user object before sending back
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    user
  });
};

exports.register = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password, role });
    sendTokenCookie(user, 201, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find user (we use .select('+password') because password is excluded by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      // Use the SAME error message for wrong email OR wrong password
      // This is intentional — don't reveal which one was wrong (security)
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    sendTokenCookie(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};

exports.logout = (req, res) => {
  // Overwrite the cookie with an empty value that expires immediately
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true
  });
  res.status(200).json({ message: 'Logged out successfully.' });
};

exports.getMe = (req, res) => {
  // req.user is already set by the protect middleware
  res.status(200).json({ user: req.user });
};