import express from 'express';

// TS complains if you use import() here, since @types/express-async-errors
// doesn't exist
require('express-async-errors'); // HAS to be right after express, or else async error catching won't work!

import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import * as  dotenv from 'dotenv';

let dotenvPath;

if (process.env.NODE_ENV === 'development') {
  dotenvPath = './src/config/dev.env' // used to be './.env'
} else if (process.env.NODE_ENV === 'production') {
  dotenvPath = './src/config/prod.env'
} else if (process.env.NODE_ENV  === 'test') {
  dotenvPath = './src/config/test.env'
}

dotenv.config({
  path: dotenvPath // specifically for this file, path: './.env' worked.
});

export const app = express();

app.use(
  cookieSession({
    signed: false, // unencrypted JWT
    secure: (process.env.NODE_ENV === 'production'), // only requires HTTPS connection (i.e. encrypted TCP/IP) when in production
  })
);
  
import { currentUserRouter } from 'routes/route-currentUser';
import { signInRouter } from 'routes/route-signIn';
import { signUpRouter } from 'routes/route-signUp';
import { signOutRouter } from 'routes/route-signOut';
import errorHandlerMW from 'middlewares/errorHandlerMW';
import NotFoundError from 'errors/not-found-error';
  
const morgan = require('morgan');

app.set('trust proxy', true); // traffic is being proxied THRU nginx. need to make express aware it's behind a proxy
app.use(json());
app.use(morgan('dev'));

// all routes are POST, except on /api/users/currentuser w/c is GET
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

// catch-all error-handling middleware to enforce consistency across the board
app.use(errorHandlerMW);

// app.get('/', (req, res) => {
//  res.send('you\'re on the / endpoint!');
// });

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

export default { app };