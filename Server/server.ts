import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error-handler';
import { rateLimiterMiddleware } from './middleware/rate-limiter.middleware';
import leadGenerationRoutes from './routes/lead-generation.routes';
import scrapingRoutes from './routes/scraping.routes';
import ChatRouter from './routes/chat.routes';

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
    // Base route
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Maritime Lead Generation API',
        status: 'healthy',
        version: '1.0.0'
      });
    });

    // API routes
    this.app.use('/api/leads', leadGenerationRoutes);
    this.app.use('/api/scraping', scrapingRoutes);
  }

  private initializeErrorHandling() {
    // Global error handler
    this.app.use(errorHandler);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }
}

// Create and start the server
const server = new Server();
server.start();

export default server;