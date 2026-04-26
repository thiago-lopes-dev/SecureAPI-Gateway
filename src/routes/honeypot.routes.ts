import { Router } from 'express';
import { honeypotMiddleware } from '../middlewares/honeypot';

const router = Router();

// Apply honeypot middleware to catch-all route at the very end of route definitions
// Or specifically bind it to known bad paths if not using the middleware globally
// Here we just export it so app.ts can mount it globally or at specific prefixes

router.all('*', honeypotMiddleware);

export default router;
