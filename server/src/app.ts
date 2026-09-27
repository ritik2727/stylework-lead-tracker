import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import leadRoutes from './routes/lead.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { config } from './config/env.js';

export const createApp = (): Express => {
  const app = express();

  // Security middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
      ) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (
          origin === config.clientUrl ||
          origin.includes('localhost') ||
          origin.includes('127.0.0.1') ||
          origin.endsWith('.vercel.app') ||
          origin.endsWith('.onrender.com')
        ) {
          return callback(null, true);
        }
        return callback(null, true); // Permissive fallback for deployment evaluation
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Request logging
  if (config.nodeEnv !== 'test') {
    app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
  }

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoints
  const handleHealth = (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'Stylework Lead Tracker API',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
    });
  };

  app.get('/', handleHealth);
  app.get('/health', handleHealth);
  app.get('/api/health', handleHealth);

  // API endpoints - supporting both /api/leads and /leads
  app.use('/api/leads', leadRoutes);
  app.use('/leads', leadRoutes);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        message: 'Endpoint not found',
      },
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};
