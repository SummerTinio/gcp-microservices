import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import app from "express-server";
import { dbConnect, dbDisconnect } from './globalSetup';
import { globalTeardown } from './globalTeardown';

let mongod: MongoMemoryServer;

// hook to start new in-memory mongodb instance
// runs before any test
beforeAll(async () => {
  dbConnect();
  console.log(`in test, process.env.NODE_PATH===${process.env.NODE_PATH}`);
  console.log(`in test, process.env.JWT_KEY===${process.env.JWT_KEY}`);
  console.log(`in test, process.env.TEST_PORT===${process.env.TEST_PORT}`);
  console.log(`in test, process.env.PORT===${process.env.PORT}`);
  
  /** 
  // mongod (await this) --> .getUri (do not await this)--> 

  // in v7.0.0+, MongoMemoryServer starts an mongodb instance when .create() OR .start() is invoked
  // 'new' in new MongoMemoryServer() no longer creates an instance automatically
  mongod = await MongoMemoryServer.create(); // 

  mongod.on('connected', () => {
    console.log(this.state);
  })
  // do not await .getUri() -- no longer async in v7.0.0+
  const uri = mongod.getUri(); // resulting uri differs based on available ephemeral port used. 

  console.log(`uri===${uri}`);

  const PORT = process.env.TEST_PORT;
  // from docs: Every MongoMemoryServer instance creates and starts a fresh 
  // MongoDB server on some free port. You may start up several mongod simultaneously. 
  // When you terminate your script or call stop(), the MongoDB server(s) will be automatically shutdown.
  // mongodb = await MongoMemoryServer.create();

  await mongod.start();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }); 
  */
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
  await dbDisconnect(); // 1st: disconnects mongoose
  await globalTeardown(); // 2nd: kills mongodb instance

  // to avoid memory leaks -- do this in specific order: 
  // close mongoose connection --> stop MongoMemoryServer instance
  // await mongoose.connection.close(true);
  // await mongod.stop(true);
  // await mongod.stop(true);

  // MongoMemoryServer.stop(true);
})