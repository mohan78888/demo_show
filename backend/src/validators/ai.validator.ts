import { z } from 'zod';

export const aiChatSchema = z.object({
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        text: z.string().max(2000, 'History message exceeds maximum length of 2000 characters').optional().default(''),
      })
    )
    .max(20, 'History cannot exceed 20 messages')
    .optional()
    .default([]),
  newMessage: z
    .string()
    .min(1, 'newMessage is required')
    .max(1000, 'Message cannot exceed 1000 characters')
    .trim(),
});

export type AiChatInput = z.infer<typeof aiChatSchema>;
