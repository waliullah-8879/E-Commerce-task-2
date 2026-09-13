import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import { errorHandler } from './middleware/error.js';

const app = express();

app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      process.env.CLIENT_ORIGIN,
      'http://localhost:5173',
      'http://localhost:4173',
    ].filter(Boolean);
    if (!origin || allowed.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return cb(null, true);
    }
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use(errorHandler);

export default app;
