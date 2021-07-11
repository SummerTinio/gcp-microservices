import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import * as  dotenv from 'dotenv';
import app from "express-server";

let mongodb: MongoMemoryServer;

// don't use async -- or TS will think ur returning a promise
global.signin = () => {// specifically for non-auth microservices:
  // Build a JWT payload. === { id, email, iat: }
  const plaintextPayload = {
    id: '192455631',
    email: 'jakesim@test.com'
  }

  // Create the JWT using jwt.sign 
  const token = jwt.sign(plaintextPayload, process.env.JWT_KEY!);

  // Build a session object. { jwt: 'ljkgdflkjfdkjggibberish'}
  const session = { jwt: token };

  // Turn that session into JSON { "jwt": "ljkgdflkjfdkjggibberish" }
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64 express:sess=SDFHIIKFNSAFIFNthisgibberishrighthere
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string -- cookie with encoded data. set it as a key-value pair express:sess=ggffgdkbase64gibberish  
  const cookie = `express:sess=${base64}`;

  return [cookie]; // return cookie in an array -- specifically for supertest
}

// hook to start new in-memory mongodb instance
// runs before any test
beforeAll(async () => {
  process.env.JWT_KEY = 'fever';

  // from docs: Every MongoMemoryServer instance creates and starts a fresh 
  // MongoDB server on some free port. You may start up several mongod simultaneously. 
  // When you terminate your script or call stop(), the MongoDB server(s) will be automatically shutdown.
  mongodb = await MongoMemoryServer.create();

  console.log(`mongodb.instanceInfo===${mongodb.instanceInfo}. if this is undefined, it means instance isnt running.`)
  const instanceUri = mongodb.getUri(); // differs based on available ephemeral port used

  console.log(`instanceUri===${instanceUri}`);
  (global as any).__MONGOINSTANCE = mongodb; // pu

  await mongoose.connect(instanceUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
  // const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;
  // await instance.stop()
  await mongodb.stop();  
  // await mongodb.stop();
  await mongoose.connection.close();
})