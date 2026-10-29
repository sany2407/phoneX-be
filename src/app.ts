import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './config/swagger';
import { errorMiddleware } from './middleware/error.middleware';
import { env } from './config/env';
import apiRouter from './routes/index';

const app = express();

// Behind nginx: trust exactly one proxy hop so req.ip is the real client.
// Without this the rate limiter keys every request to the nginx socket and
// one visitor can exhaust the quota for everybody.
app.set('trust proxy', 1);

// Security
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Rate limiting — tunable per environment, because a frontend build alone
// costs ~66 requests against the catalogue endpoints.
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: env.RATE_LIMIT_MAX,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  // Health probes must never consume quota (or be locked out), otherwise a
  // container healthcheck can fail and take the API down.
  skip: (req) => req.path === '/v1/health',
});
app.use('/api', limiter);

// Raw body for Razorpay webhook (must be before express.json())
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Swagger docs
setupSwagger(app);

// API routes
app.use('/api/v1', apiRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorMiddleware);

export default app;
