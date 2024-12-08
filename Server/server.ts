import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error-handler';
import { rateLimiterMiddleware } from './middleware/rate-limiter.middleware';
import leadGenerationRoutes from './routes/lead-generation.routes';
import scrapingRoutes from './routes/scraping.routes';
import ChatRoute from './routes/chat.routes';
import LeadGenerationWorkflow, { initLeadGenerationWorkflow } from './services/workflow/lead-generation-workflow.service';
import Logger from './utils/logger';
import puppeteer from 'puppeteer';


// Load environment variables
dotenv.config();

class Server {
  public app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000', 10);

    // Initialize middleware
    this.initializeMiddlewares();

    // Initialize routes
    this.initializeRoutes();

    // Initialize error handling
    this.initializeErrorHandling();
   
  }

  private initializeMiddlewares() {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // JSON parsing middleware
    this.app.use(express.json({ limit: '50mb' }));

    // Rate limiting middleware
    this.app.use(rateLimiterMiddleware);
  }

  private initializeRoutes() {
    // Maritime leads generation route
    this.app.get('/api/maritime-leads', async (req, res, next) => {
      try {
        const leadGenerationWorkflow = new LeadGenerationWorkflow();
        const leadResults = await leadGenerationWorkflow.generateLeads();

        res.json({
          success: true,
          data: leadResults
        });
      } catch (error) {
        next(error);
      }
    });

    // API route registrations
    this.app.use('/api/generate', leadGenerationRoutes);
    this.app.use('/api/scraping', scrapingRoutes);
    this.app.use('/api/chat', ChatRoute);
  }

  private initializeErrorHandling() {
    // Global error handler
    this.app.use(errorHandler);
  }

  public async start() {
    try {
      // Start the server
      this.app.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
      // Initialize Lead Generation Workflow works every 12 hrs from the start of server(crone job)
      await initLeadGenerationWorkflow();
      Logger.info('Lead Generation Workflow initialized');


    } catch (error) {
      Logger.error('Failed to start server', error);
      process.exit(1);
    }

  }
}

// Create and start the server
const server = new Server();
server.start();

export default server;