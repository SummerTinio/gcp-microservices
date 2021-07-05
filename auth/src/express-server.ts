import express from 'express';

// TS complains if you use import() here, since @types/express-async-errors
// doesn't exist
require('express-async-errors'); // HAS to be right after express, or else async error catching won't work!

import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from 'routes/route-currentUser';
import { signInRouter } from 'routes/route-signIn';
import { signUpRouter } from 'routes/route-signUp';
import { signOutRouter } from 'routes/route-signOut';
import errorHandlerMW from 'middlewares/errorHandlerMW';
import NotFoundError from 'errors/not-found-error';
import startDb from './mongodb-starter';

const morgan = require('morgan');

const app = express();
app.set('trust proxy', true); // traffic is being proxied THRU nginx. need to make express aware it's behind a proxy
app.use(json());
app.use(
  cookieSession({
    signed: false, // unencrypted JWT
    secure: true, // requires HTTPS connection (i.e. encrypted TCP/IP)
  })
);
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

startDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}!`);
});