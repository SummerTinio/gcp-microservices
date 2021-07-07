import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './utils/config';

export const globalTeardown = async function stopMongoMemoryServerInstance() {
  if (config.Memory) { // Config to decided if an mongodb-memory-server instance should be used
    const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;
    await instance.stop();
  }
};

// await mongoose.connection.db.dropDatabase();
// await mongoose.disconnect();

