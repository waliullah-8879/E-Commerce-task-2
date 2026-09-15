import { connectDb } from '../server/src/config/db.js';
import app from '../server/src/app.js';

// Initiate DB connection at module load (Vercel cold start).
let dbReady = connectDb();

// Vercel calls this exported function for every incoming request.
// We await the DB connection before handing off to Express.
export default async function handler(req, res) {
  try {
    await dbReady;
  } catch (err) {
    // If the connection failed, retry once for the next request
    console.error('[DB] Connection failed, will retry:', err.message);
    dbReady = connectDb(); // reset so next request retries
    return res.status(500).json({ message: `Database connection failed: ${err.message}` });
  }
  // Hand off to Express
  return app(req, res);
}

