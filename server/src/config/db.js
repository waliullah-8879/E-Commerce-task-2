import mongoose from 'mongoose';

let mongodInstance = null;

export async function connectDb() {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      console.log(`[DB] Connected to MongoDB at ${uri.replace(/\/\/.*@/, '//***@')}`);
      return;
    } catch (err) {
      console.warn(`[DB] Failed to connect to configured MONGODB_URI (${err.message}). Attempting in-memory fallback...`);
    }
  }

  // Zero-config developer fallback using embedded MongoMemoryServer
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

