import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pool from './config/database';
import authRoutes from './routes/auth';
import promptRoutes from './routes/prompts';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de prompts
app.use('/api/prompts', promptRoutes);

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
      generate: '/api/generate'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
