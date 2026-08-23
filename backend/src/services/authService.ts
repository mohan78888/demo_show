import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import env from '../config/env.js';
import AppError from '../utils/AppError.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from './emailService.js';
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

import { verifyGoogleIdToken } from './googleAuth.js';

export const loginWithGoogle = async (idToken: string) => {
  const googleUser = await verifyGoogleIdToken(idToken);

  let user = await User.findOne({
    $or: [{ googleId: googleUser.googleId }, { email: googleUser.email }],
  });

  if (user) {
    // Link googleId if existing user signed in with email before
    if (!user.googleId) {
      user.googleId = googleUser.googleId;
    }
    if (!user.profileImage && googleUser.picture) {
      user.profileImage = googleUser.picture;
    }
    if (!user.avatar && googleUser.picture) {
      user.avatar = googleUser.picture;
    }
    user.isEmailVerified = true;
    user.lastLogin = new Date();
    await user.save();
  } else {
    user = new User({
      firstName: googleUser.firstName,
      lastName: googleUser.lastName || '',
      email: googleUser.email,
      googleId: googleUser.googleId,
      authProvider: 'google',
      avatar: googleUser.picture,
      profileImage: googleUser.picture,
      isEmailVerified: true,
      lastLogin: new Date(),
    });
    await user.save();

    // Async welcome email trigger
    sendWelcomeEmail({ email: user.email, firstName: user.firstName }).catch((emailErr) => {
      logger.error(`[Google Signup Email Async Error]: ${emailErr?.message || emailErr}`);
    });
  }

  const token = generateToken(user._id.toString(), user.email, user.role);

  return {
    token,
    user: formatUserResponse(user),
  };
};

export const handleSocialLogin = async (data: { idToken: string }) => {
  // SECURITY: Verify the token cryptographically with Google's servers.
  // Never trust raw email/name from the client — extract from verified payload only.
  const verifiedUser = await verifyGoogleIdToken(data.idToken);

  let user = await User.findOne({
    $or: [{ googleId: verifiedUser.googleId }, { email: verifiedUser.email }],
  });

  if (user) {
    // Link googleId if existing user signed in with email/password before
    if (!user.googleId) {
      user.googleId = verifiedUser.googleId;
    }
    if (!user.profileImage && verifiedUser.picture) {
      user.profileImage = verifiedUser.picture;
    }
    if (!user.avatar && verifiedUser.picture) {
      user.avatar = verifiedUser.picture;
    }
    user.isEmailVerified = true;
    user.lastLogin = new Date();
    await user.save();
  } else {
    user = new User({
      firstName: verifiedUser.firstName,
      lastName: verifiedUser.lastName || '',
      email: verifiedUser.email,
      googleId: verifiedUser.googleId,
      authProvider: 'google',
      avatar: verifiedUser.picture,
      profileImage: verifiedUser.picture,
      isEmailVerified: true,
      lastLogin: new Date(),
    });
    await user.save();

    // Async welcome email trigger
    sendWelcomeEmail({ email: user.email, firstName: user.firstName }).catch((emailErr) => {
      logger.error(`[Social Signup Email Async Error]: ${emailErr?.message || emailErr}`);
    });
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

export const forgotPassword = async (email: string) => {
  const cleanEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail });

  if (!user) {
    // For security, do not reveal if email exists or not
    return {
      message: 'If an account exists with this email, a password reset link has been sent.',
    };
  }

  // Generate 32-byte cryptographic token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token before storing in DB
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set 15 minutes expiry
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const frontendBase = env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${frontendBase}/reset-password?token=${resetToken}`;

  // Send password reset email asynchronously
  sendPasswordResetEmail({
    email: user.email,
    firstName: user.firstName,
    resetUrl,
  }).catch((err) => {
    logger.error(`[Forgot Password Email Error]: ${err?.message || err}`);
  });

  return {
    message: 'If an account exists with this email, a password reset link has been sent.',
  };
};

export const resetPassword = async (resetToken: string, newPassword: string) => {
  if (!resetToken || !newPassword) {
    throw new AppError('Token and new password are required.', 400);
  }

  if (newPassword.length < 6) {
    throw new AppError('Password must be at least 6 characters long.', 400);
  }

  // Hash the incoming plaintext token to compare with DB
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: new Date() },
  }).select('+password');

  if (!user) {
    throw new AppError('Password reset link is invalid or has expired.', 400);
  }

  // Set new password (pre('save') hook will hash it with bcrypt)
  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();

  const token = generateToken(user._id.toString(), user.email, user.role);

  return {
    token,
    user: formatUserResponse(user),
    message: 'Password reset successful. You are now logged in.',
  };
};

export const formatUserResponse = (user: IUser) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  name: user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName,
  email: user.email,
  role: user.role,
  authProvider: user.authProvider || 'local',
  avatar: user.avatar || user.profileImage || '',
  profileImage: user.profileImage || user.avatar || '',
  isEmailVerified: user.isEmailVerified,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
});
