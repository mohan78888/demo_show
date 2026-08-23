import { Router } from 'express';
import {
  signup,
  login,
  googleLogin,
  socialLogin,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  signupSchema,
  loginSchema,
  googleAuthSchema,
  socialLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/signup', authLimiter, validateBody(signupSchema), signup);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/google', authLimiter, validateBody(googleAuthSchema), googleLogin);
router.post('/social', authLimiter, validateBody(socialLoginSchema), socialLogin);
router.post('/logout', logout);
router.post('/forgot-password', passwordResetLimiter, validateBody(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', passwordResetLimiter, validateBody(resetPasswordSchema), resetPassword);

router.get('/profile', authMiddleware, getProfile as any);
router.put('/profile', authMiddleware, validateBody(updateProfileSchema), updateProfile as any);

export default router;
