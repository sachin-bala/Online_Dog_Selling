import mongoose from 'mongoose';
import { env } from './environment.js';

// Disable buffering so queries fail fast if DB is disconnected
mongoose.set('bufferCommands', false);

let mongoMemoryServerInstance: any = null;

export const connectDB = async (): Promise<boolean> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[ PawVerse DB ] MongoDB connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`[ PawVerse DB ] Standalone MongoDB at ${env.MONGODB_URI} unreachable (${error.message}).`);
    console.log(`[ PawVerse DB ] Initializing MongoDB Memory Server fallback...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServerInstance = await MongoMemoryServer.create({
        instance: { dbName: 'pawverse' },
      });
      const mongoUri = mongoMemoryServerInstance.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`[ PawVerse DB ] Connected to embedded MongoDB Memory Instance: ${mongoUri} (host: ${conn.connection.host})`);
      return true;
    } catch (memErr: any) {
      console.error(`[ PawVerse DB Error ] Failed to start MongoDB Memory Server: ${memErr.message}`);
      return false;
    }
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServerInstance) {
    await mongoMemoryServerInstance.stop();
  }
};
