import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { generateFakeConfig, generateFakeUsers, generateFakeWpAdmin } from '../utils/fakeDataGenerator';

const HONEYPOT_PATHS = [
  '/.env',
  '/wp-admin',
  '/admin',
  '/administrator',
  '/config.json',
  '/phpmyadmin',
  '/.git/config'
];

export const honeypotMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const isHoneypotTrigger = HONEYPOT_PATHS.some(path => req.path.startsWith(path));

  if (isHoneypotTrigger) {
    // Log the attacker telemetry securely
    logger.warn('HONEYPOT TRIGGERED', {
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: req.headers,
      query: req.query,
      body: req.body // Be careful with logging huge bodies, but useful for analysis
    });

    // Simulate delay to waste scanner's time (Tarpitting)
    setTimeout(() => {
      if (req.path.includes('wp-admin')) {
        return res.status(200).type('text/html').send(generateFakeWpAdmin());
      }
      
      if (req.path.includes('.env') || req.path.includes('config')) {
        return res.status(200).json(generateFakeConfig());
      }

      if (req.path.includes('admin')) {
        return res.status(200).json({ success: true, data: generateFakeUsers() });
      }

      // Default fake response
      res.status(200).json({ status: 'ok', version: '1.0.0' });
    }, Math.floor(Math.random() * 2000) + 1000); // 1-3 seconds delay
  } else {
    next();
  }
};
