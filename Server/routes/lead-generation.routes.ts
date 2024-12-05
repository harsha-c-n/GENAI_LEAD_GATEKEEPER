import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import LeadGenerationService from '../services/lead-generation/lead-generation.service';
import LeadGenerationWorkflow from '../services/workflow/lead-generation-workflow.service';
import { authMiddleware } from '../middleware/auth.middleware';

// Define a custom request type
interface CustomRequest extends Request {
  user?: string | jwt.JwtPayload;
}

const router = express.Router();
const leadGenerationService = new LeadGenerationService();
const leadGenerationWorkflow = new LeadGenerationWorkflow();

// Update the route handler to use async and explicitly type the parameters
router.post('/generate', 
  authMiddleware,
  async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query, sources } = req.body;

      // Validate input
      if (!query) {
        res.status(400).json({ error: 'Query is required' });
        return;
      }

      // Generate leads using workflow
      const leadResults = await leadGenerationWorkflow.generateLeads(query);

      res.json({
        success: true,
        data: leadResults
      });
    } catch (error) {
      next(error);
    }
  }
);

// Similarly for other routes
router.post('/insights', 
  authMiddleware,
  async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { documents, query } = req.body;

      // Generate lead insights
      const insights = await leadGenerationService.generateLeadInsights(documents, query);

      res.json({
        success: true,
        insights
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;