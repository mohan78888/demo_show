import { Router } from 'express';
import { chatWithAgent, chatWithAgentStream } from '../controllers/aiController.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { aiChatSchema } from '../validators/ai.validator.js';

const router = Router();

router.post('/chat', aiLimiter, validateBody(aiChatSchema), chatWithAgent);
router.post('/chat-stream', aiLimiter, validateBody(aiChatSchema), chatWithAgentStream);

export default router;


