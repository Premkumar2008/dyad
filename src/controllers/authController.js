const jwt = require('jsonwebtoken');
const env = require('../config/env');
const logger = require('../config/logger');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

function signToken(id, role) {
  return jwt.sign({ id, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  });

  logger.info('User registered', { userId: user._id, email: user.email, role: user.role });

  res.status(201).json({
    status: 'success',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user._id, user.role);

  logger.info('User logged in', { userId: user._id, email: user.email, role: user.role });

  res.status(200).json({
    status: 'success',
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: req.user
  });
});

const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-__v');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users
  });
});

module.exports = {
  register,
  login,
  getMe,
  getAllUsers
};
