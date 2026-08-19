import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import * as authService from '../services/authService.js';

export const signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token: result.token,
    user: result.user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.loginUser(req.body);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token: result.token,
    user: result.user,
  });
});

export const socialLogin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.handleSocialLogin(req.body);
  res.status(200).json({
    success: true,
    message: `${req.body.provider || 'Social'} login successful`,
    token: result.token,
    user: result.user,
  });
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized. User ID not found in token.' });
    return;
  }
  const userProfile = await authService.getUserProfile(userId);
  res.status(200).json({
    success: true,
    user: userProfile,
  });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized. User ID not found in token.' });
    return;
  }
  const updatedUser = await authService.updateUserProfile(userId, req.body);
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: updatedUser,
  });
});
