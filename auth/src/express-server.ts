import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import { currentUserRouter } from './routes/route-currentUser';
import { signInRouter } from './routes/route-signIn';
import { signUpRouter } from './routes/route-signUp';
import { signOutRouter } from './routes/route-signOut';
import errorHandlerMW from './middlewares/errorHandlerMW';
import NotFoundError from './errors/not-found-error';
import tryCatcher from './utils/tryCatcherMW';

// TS complains if you use import() here, since @types/express-async-errors
// doesn't exist
require('express-async-errors');

const morgan = require('morgan');

const app = express();
app.use(json());
app.use(morgan('dev'));

// all routes are POST, except on /api/users/currentuser w/c is GET
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

// catch-all error-handling middleware to enforce consistency across the board
app.use(errorHandlerMW);

app.get('/', (req, res) => {
  res.send('you\'re on the / endpoint!');
});

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

const PORT = process.env.PORT || 3000;

// latest version of node supports await keyword at top level,
// but depending on VM's node version, node image might not support it.
// so must wrap async fxn inside another variable
const startDb = async function startMongoConnection() {
  const ms = 'auth'; // name of microservice

  const mongodbService = `${ms}-mongo-srv`;

  try {
    let uri: any;

    if (process.env.NODE_ENV === 'development') {
      uri = `mongodb://localhost:27017/${ms}`;
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

    app.listen(PORT, () => {
      console.log(`Listening on Port ${PORT}!`);
    });
  } catch (err) {
    console.log(`caught you from express-server.ts! err === ${err}`);
    console.error(err);
  }
};

startDb();
