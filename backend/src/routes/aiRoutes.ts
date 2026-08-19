import { Router } from 'express';
import { chatWithAgent } from '../controllers/aiController.js';

const router = Router();

router.post('/chat', chatWithAgent);

export default router;
