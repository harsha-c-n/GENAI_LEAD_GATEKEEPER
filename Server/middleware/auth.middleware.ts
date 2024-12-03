import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define a custom request type
interface CustomRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};