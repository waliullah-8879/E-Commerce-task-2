import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDb } from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import { errorHandler } from './middleware/error.js';
import { runAutoSeed } from './seedData.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDb().then(async () => {
  try {
    await runAutoSeed();
  } catch (err) {
    console.error('[DB] Auto-seed failed:', err);
  }
  app.listen(port, () => console.log(`API listening on ${port}`));
}).catch((error) => { 
  console.error(error); 
  process.exit(1); 
});
