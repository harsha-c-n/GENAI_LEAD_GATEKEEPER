import express, { Request, Response, NextFunction } from 'express';
import WebScraperService from '../services/web-scrapper/web-scrapper.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const webScraperService = new WebScraperService();

// Configure scraping sources
router.post('/configure', 
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sources } = req.body;

      // Validate input
      if (!sources || !Array.isArray(sources)) {
        res.status(400).json({ error: 'Invalid sources configuration' });
        return;
      }

      // Update sources in the service
      webScraperService.updateSources(sources);

      res.json({
        success: true,
        message: 'Sources updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

// Perform web scraping
router.post('/scrape', 
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      // If sources are provided, use them; otherwise, use default sources
      const scrapedData = await webScraperService.scrapeWebsites();

      res.json({
        success: true,
        data: scrapedData
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;