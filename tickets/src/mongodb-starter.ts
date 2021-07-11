// TS complains if you use import() here, since @types/express-async-errors
// doesn't exist
require('express-async-errors'); // HAS to be right after express, or else async error catching won't work!
import mongoose from 'mongoose';

import { app } from 'express-server';

const PORT = process.env.PORT || 3000;

// latest version of node supports await keyword at top level,
// but depending on VM's node version, node image might not support it.
// so must wrap async fxn inside another variable
const startDb = async function startMongoConnection() {
  const ms = process.env.MS; // name of microservice

  const mongodbService = `${ms}-mongo-srv`;

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    let uri: any;

    if (process.env.NODE_ENV === 'development') {
      const localMongoDbPort = 14440;
      uri = `mongodb://localhost:${localMongoDbPort}/${ms}`;

    } else if (process.env.NODE_ENV === 'production') {
      // will automatically create a db collection named after ms
      uri = `mongodb://${mongodbService}:27017/${ms}`; // from mongoDB service itself, e.g. metadata.name === auth-mongo-srv
   
    } else if (process.env.NODE_ENV === 'test') {
      // TO DO: FIX TESTS
      
      // const testMongoDbPort = 27017;
      // uri = `mongodb://localhost:${testMongoDbPort}/${ms}`;
      // uri = global.__MONGOINSTANCE.getUri();
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    // if mongoose has successfully connected to db, 
    if (mongoose.connection.readyState === 1) {
      console.log(`[${ms}] Mongoose connected to MongoDB instance on uri: ${uri}`);
    }
    
    // mongoose.connection event emitter not working
    // mongoose.connection.on('connected', () => {
    //   console.log('connected to db!');
    // })
    
    app.listen(PORT, () => {
      console.log(`[${ms}] Express server: listening on Port ${PORT}!`);
    });

  } catch (err) {
    console.log(`[${ms}] db-connection error: caught you from mongodb-starter.ts! err === ${err}`);
    console.error(err);
  }
};

startDb();