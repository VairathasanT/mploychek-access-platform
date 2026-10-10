import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import recordRoutes from './routes/record.routes';
import userRoutes from './routes/user.routes';

const app = express();

// Disable Express ETag caching
app.disable('etag');

// Middleware
app.use(cors());
app.use(express.json());

// Disable browser/proxy caching for API responses
app.use((_req, res, next) => {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'MPloyChek API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/users', userRoutes);

export default app;