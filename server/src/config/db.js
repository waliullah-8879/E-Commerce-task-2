import mongoose from 'mongoose';

let mongodInstance = null;
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

export async function connectDb() {
  // If already connected, reuse the connection (important for Vercel serverless)
  if (mongoose.connection.readyState === 1) {
    console.log('[DB] Reusing existing MongoDB connection.');
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri && IS_PRODUCTION) {
    throw new Error('[DB] MONGODB_URI environment variable is not set. Please add it to your Vercel project settings.');
  }

  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
      console.log(`[DB] Connected to MongoDB Atlas.`);
      return;
    } catch (err) {
      const msg = `[DB] Failed to connect to MONGODB_URI: ${err.message}`;
      console.error(msg);
      if (IS_PRODUCTION) {
        // In production, throw immediately — no fallback (binary can't be downloaded on Vercel)
        throw new Error(msg);
      }
      console.warn('[DB] Attempting in-memory fallback...');
    }
  }

  // Zero-config developer fallback (local dev only)
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create({
      instance: { dbName: 'northstar' }
    });
    const memoryUri = mongodInstance.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[DB] Connected to embedded MongoDB (in-memory) at ${memoryUri}`);
  } catch (memErr) {
    console.error('[DB] Could not start embedded MongoDB:', memErr.message);
    throw memErr;
  }
}

export async function disconnectDb() {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
}

