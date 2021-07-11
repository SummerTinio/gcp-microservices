import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import * as  dotenv from 'dotenv';
import app from "express-server";

let mongodb: MongoMemoryServer;

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email, password
    })
    .expect(201)
  
  const cookie = response.get('Set-Cookie');

  return cookie;
}

// hook to start new in-memory mongodb instance
// runs before any test
beforeAll(async () => {

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
  // await mongodb.stop();  
  // await mongodb.stop();
  await mongoose.connection.close();
})