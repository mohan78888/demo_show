import { Router } from 'express';
import { signup, login, socialLogin, getProfile, updateProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { signupSchema, loginSchema, socialLoginSchema, updateProfileSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/signup', authLimiter, validateBody(signupSchema), signup);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/social', authLimiter, validateBody(socialLoginSchema), socialLogin);

router.get('/profile', authMiddleware, getProfile as any);
router.put('/profile', authMiddleware, validateBody(updateProfileSchema), updateProfile as any);

export default router;
