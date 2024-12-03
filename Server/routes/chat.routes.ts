import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/', async (req, res) => {
    try {
      const { messages } = req.body;
  
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: messages.map((m: { role: any; content: any; }) => ({
          role: m.role,
          content: m.content
        }))
      });
  
      res.json({
        role: 'assistant',
        content: response.choices[0].message.content
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Chat error:', error.message);
        res.status(500).json({ 
          error: 'Chat failed', 
          details: error.message 
        });
      } else {
        console.error('Unknown error:', error);
        res.status(500).json({ 
          error: 'Chat failed', 
          details: 'An unknown error occurred' 
        });
      }
    }
  });

export default router;