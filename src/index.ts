import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pool from './config/database';
import authRoutes from './routes/auth';
import promptRoutes from './routes/prompts';
import imageRoutes from './routes/images';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Configure Helmet with relaxed CSP for development
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "http://localhost:*", "https://localhost:*"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", "http://localhost:*", "https://localhost:*"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// Configure CORS to allow frontend access
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Vite default port
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({limit:'16mb'}));
app.use(express.urlencoded({ extended: true }));

// Serve static images with proper CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static('uploads'));

// Rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/images', imageRoutes);

app.get('/health', async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'ImaGenSD API - Welcome',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      prompts: '/api/prompts',
      images: '/api/images',
      generate: '/api/images/generate'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
