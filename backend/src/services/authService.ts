import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import env from '../config/env.js';
import AppError from '../utils/AppError.js';
import { sendWelcomeEmail } from './emailService.js';
import logger from '../config/logger.js';

export const generateToken = (id: string, email: string, role: string): string => {
  return jwt.sign({ id, email, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRE as any });
};

export const registerUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}) => {
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanFirstName = data.firstName.trim();
  const cleanLastName = data.lastName.trim();

  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    throw new AppError('A user with this email already exists.', 400);
  }

  const user = new User({
    firstName: cleanFirstName,
    lastName: cleanLastName,
    email: cleanEmail,
    password: data.password,
  });

  await user.save();

  // Async welcome email trigger
  sendWelcomeEmail({ email: user.email, firstName: user.firstName }).catch((emailErr) => {
    logger.error(`[Signup Email Async Error]: ${emailErr?.message || emailErr}`);
  });

  const token = generateToken(user._id.toString(), user.email, user.role);

  return {
    token,
    user: formatUserResponse(user),
  };
};

export const loginUser = async (data: { email: string; password?: string }) => {
  if (!data.password) {
    throw new AppError('Password is required.', 400);
  }

  const user = await User.findOne({ email: data.email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await user.matchPassword(data.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id.toString(), user.email, user.role);

  return {
    token,
    user: formatUserResponse(user),
  };
};

export const handleSocialLogin = async (data: {
  provider?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
}) => {
  let user = await User.findOne({ email: data.email.toLowerCase() });

  if (!user) {
    const generatedPassword = `Social_${Math.random().toString(36).slice(-8)}_${Date.now()}!A1`;
    user = new User({
      firstName: data.firstName || data.provider || 'Social',
      lastName: data.lastName || 'User',
      email: data.email.toLowerCase(),
      password: generatedPassword,
      profileImage: data.profileImage || '',
      isEmailVerified: true,
    });
    await user.save();
  } else {
    user.lastLogin = new Date();
    if (data.profileImage && !user.profileImage) {
      user.profileImage = data.profileImage;
    }
    await user.save();
  }

  const token = generateToken(user._id.toString(), user.email, user.role);

  return {
    token,
    user: formatUserResponse(user),
  };
};

export const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return formatUserResponse(user);
};

export const updateUserProfile = async (
  userId: string,
  updates: { firstName?: string; lastName?: string; profileImage?: string }
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (updates.firstName) user.firstName = updates.firstName;
  if (updates.lastName) user.lastName = updates.lastName;
  if (updates.profileImage !== undefined) user.profileImage = updates.profileImage;

  await user.save();
  return formatUserResponse(user);
};

export const formatUserResponse = (user: IUser) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  name: `${user.firstName} ${user.lastName}`,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
  isEmailVerified: user.isEmailVerified,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
});
