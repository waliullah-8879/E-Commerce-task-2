import 'dotenv/config';
import { connectDb } from './config/db.js';
import { runAutoSeed } from './seedData.js';
import app from './app.js';

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
