import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { logger } from '../utils/logger';

const router = Router();

// Legitimate API Route that requires Authentication
router.get('/data', authenticateJWT, (req: Request, res: Response) => {
  // In a real gateway, this would use http-proxy-middleware to forward the request
  // to the internal microservice. For this implementation, we simulate the downstream.
  
  logger.info('Legitimate request to /api/v1/data', { user: (req as any).user });
  
  res.status(200).json({
    success: true,
    data: {
      message: 'Secure data from downstream microservice',
      timestamp: new Date().toISOString()
    }
  });
});

// A public route, still protected by rate limiting and security headers from app.ts
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

export default router;
