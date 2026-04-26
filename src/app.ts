import express from 'express';
import morgan from 'morgan';
import { helmetMiddleware, corsMiddleware, enforceContentType, preventParameterPollution } from './middlewares/security';
import { globalRateLimiter } from './middlewares/rateLimiter';
import { honeypotMiddleware } from './middlewares/honeypot';
import proxyRoutes from './routes/proxy.routes';
import { logger } from './utils/logger';

const app = express();

// 1. Trust proxy if behind Nginx/Load Balancer (important for rate limiting and IP logging)
app.set('trust proxy', 1);

// 2. Active Defense (Honeypot) - Runs early to catch scanners before they consume resources
app.use(honeypotMiddleware);

// 3. Core Security Middlewares
app.use(helmetMiddleware);
app.use(corsMiddleware);

// 4. Rate Limiting (Distributed via Redis)
app.use(globalRateLimiter);

// 5. Body parsers with strict size limits (prevent DoS)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 6. Request Sanitization
app.use(enforceContentType);
app.use(preventParameterPollution);

// 7. Logging (Morgan piping to Winston)
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// 8. Legitimate Routes
app.use('/api/v1', proxyRoutes);

// 9. Catch-all for undefined legitimate routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 10. Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled Exception', { error: err.message, stack: err.stack, ip: req.ip });
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
