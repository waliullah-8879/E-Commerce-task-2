import { connectDb } from '../server/src/config/db.js';
import app from '../server/src/app.js';

let isConnected = false;

// Connect to the database before processing any requests in the serverless environment
const connectDbMiddleware = async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDb();
      isConnected = true;
    } catch (err) {
      console.error('[DB] Connection error:', err);
      return res.status(500).json({ message: 'Internal Server Error (Database)' });
    }
  }
  next();
};

app.use(connectDbMiddleware);

export default app;
