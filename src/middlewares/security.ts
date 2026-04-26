import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';

// Basic security headers
export const helmetMiddleware = helmet();

// Strict CORS policy
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // For a gateway, you might want to allow specific origins or no origins if it's API-to-API
    // Let's assume strict allowlist in production, or specific domains.
    // For this example, we'll allow specific domains or no-origin (postman etc).
    const allowedOrigins = ['https://trusted-frontend.com'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Prevent Parameter Pollution (basic custom implementation)
export const preventParameterPollution = (req: Request, res: Response, next: NextFunction) => {
  if (req.query) {
    for (const key in req.query) {
      if (Array.isArray(req.query[key])) {
        // Take the last value if multiple same-name parameters are provided (or reject entirely)
        req.query[key] = (req.query[key] as any).pop();
      }
    }
  }
  next();
};

// Strict Content-Type enforcement
export const enforceContentType = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({ error: 'Unsupported Media Type. Only application/json is allowed.' });
    }
  }
  next();
};
