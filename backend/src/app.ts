import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: '*' })); // Enable CORS for development
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', router);

// Root Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'MazhaCar Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 Route Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err.message);
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

export default app;
