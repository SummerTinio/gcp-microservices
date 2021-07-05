import express from 'express';

// TS complains if you use import() here, since @types/express-async-errors
// doesn't exist
require('express-async-errors'); // HAS to be right after express, or else async error catching won't work!

import mongoose from 'mongoose';

// latest version of node supports await keyword at top level,
// but depending on VM's node version, node image might not support it.
// so must wrap async fxn inside another variable
const startDb = async function startMongoConnection() {
  const ms = 'auth'; // name of microservice

  const mongodbService = `${ms}-mongo-srv`;

  try {
    let uri: any;

    if (process.env.NODE_ENV === 'development') {
      const localMongoDbPort = 14440;
      uri = `mongodb://localhost:${localMongoDbPort}/${ms}`;
    } else if (process.env.NODE_ENV === 'production') {
      // will automatically create a db collection named after ms
      uri = `mongodb://${mongodbService}:27017/${ms}`; // from mongoDB service itself, e.g. metadata.name === auth-mongo-srv
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('connected to db!');

  } catch (err) {
    console.log(`[${ms}] db-connection error: caught you from express-server.ts! err === ${err}`);
    console.error(err);
  }
};

export default startDb;