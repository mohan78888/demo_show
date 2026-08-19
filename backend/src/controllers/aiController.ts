import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { generateAiChatResponse } from '../services/aiService.js';

export const chatWithAgent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { history, newMessage } = req.body;

  if (!newMessage) {
    res.status(400).json({ success: false, error: 'newMessage is required' });
    return;
  }

  const responseText = await generateAiChatResponse(history, newMessage);
  res.status(200).json({ text: responseText });
});
