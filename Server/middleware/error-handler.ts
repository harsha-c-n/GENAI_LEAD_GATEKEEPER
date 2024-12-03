import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';

export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Log the error
  Logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Send error response
  res.status(500).json({
    success: false,
    error: {
      message: err.message,
      // Only include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};