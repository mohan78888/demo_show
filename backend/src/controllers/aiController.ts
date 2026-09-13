import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { generateAiChatResponse, streamAiChatResponse } from '../services/aiService.js';
import logger from '../config/logger.js';

export const chatWithAgent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { history, newMessage } = req.body;

    const responseText = await generateAiChatResponse(history || [], newMessage);

    res.status(200).json({
      success: true,
      text: responseText,
    });
  }
);

export const chatWithAgentStream = async (req: Request, res: Response): Promise<void> => {
  const { history, newMessage } = req.body;

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  let isAborted = false;
  req.on('close', () => {
    isAborted = true;
  });

  try {
    for await (const chunk of streamAiChatResponse(history || [], newMessage)) {
      if (isAborted) break;
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }
    if (!isAborted) {
      res.write('data: [DONE]\n\n');
    }
  } catch (error: any) {
    logger.error({ error }, 'Error during AI streaming');
    if (!isAborted) {
      res.write(`data: ${JSON.stringify({ error: 'Streaming encountered an error' })}\n\n`);
    }
  } finally {
    if (!res.writableEnded) {
      res.end();
    }
  }
};