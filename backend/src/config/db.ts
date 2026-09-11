import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<string> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/omnicross';
  try {
    // Attempt standard connection first with a short timeout
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[DB] Connected to MongoDB at ${uri}`);
    return uri;
  } catch (err) {
    console.warn(`[DB] Standard MongoDB connection failed, starting MongoMemoryServer...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[DB] Connected to MongoMemoryServer at ${memUri}`);
      return memUri;
    } catch (memErr) {
      console.error('[DB] MongoMemoryServer error:', memErr);
      throw memErr;
    }
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
