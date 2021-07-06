import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../express-server';

let mongodb: any;

// hook to start new in-memory mongodb instance
// runs before any test
beforeAll(async () => {
  mongodb = new MongoMemoryServer();
  const mongodbUri = await mongodb.getUri();
  
  await mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// delete all existing db collections before every test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// stop mongodb instance,
// close mongoose connection
afterAll(async () => {
  await mongodb.stop();
  await mongoose.connection.close();
})