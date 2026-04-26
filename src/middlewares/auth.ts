import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, env.JWT_SECRET, (err, user) => {
      if (err) {
        logger.warn('Invalid JWT token attempt', { ip: req.ip, error: err.message });
        return res.status(403).json({ error: 'Forbidden', message: 'Invalid token' });
      }

      req.user = user;
      next();
    });
  } else {
    logger.warn('Missing JWT token', { ip: req.ip, path: req.path });
    res.status(401).json({ error: 'Unauthorized', message: 'Auth token is missing' });
  }
};
