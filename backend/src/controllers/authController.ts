import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import * as authService from '../services/authService.js';
import env from '../config/env.js';

/**
 * Attaches a secure HttpOnly JWT cookie to the response.
 * XSS immune (JavaScript cannot access it) with CSRF Lax protection.
 */
const setAuthCookie = (res: Response, token: string): void => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

export const signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.registerUser(req.body);
  setAuthCookie(res, result.token);
  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token: result.token,
    user: result.user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.loginUser(req.body);
  setAuthCookie(res, result.token);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token: result.token,
    user: result.user,
  });
});

export const googleLogin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.loginWithGoogle(req.body.idToken);
  setAuthCookie(res, result.token);
  res.status(200).json({
    success: true,
    message: 'Google login successful',
    token: result.token,
    user: result.user,
  });
});

export const socialLogin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.handleSocialLogin({ idToken: req.body.idToken });
  setAuthCookie(res, result.token);
  res.status(200).json({
    success: true,
    message: 'Social login successful',
    token: result.token,
    user: result.user,
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.forgotPassword(req.body.email);
  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.resetPassword(req.body.token, req.body.password);
  setAuthCookie(res, result.token);
  res.status(200).json({
    success: true,
    message: result.message,
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
