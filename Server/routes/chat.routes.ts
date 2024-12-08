import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import LeadGenerationWorkflow from '../services/workflow/lead-generation-workflow.service';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const ChatRoute = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const leadGenerator = new LeadGenerationWorkflow();


ChatRoute.post('/', async (req, res) => {
    try {
      const { messages } = req.body;
      const message= messages[messages?.length-1]?.content
      const response = await leadGenerator.generateLeads(message)
     
      res.json({
        role: 'assistant',
        content: response
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

export default ChatRoute;