import express from 'express';
import { json } from 'body-parser';

import { currentUserRouter } from './routes/route-currentUser';
import { signInRouter } from './routes/route-signIn';
import { signUpRouter } from './routes/route-signUp';
import { signOutRouter } from './routes/route-signOut';
import errorHandlerMW from './middlewares/errorHandlerMW';
import NotFoundError from './errors/not-found-error';

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

const devPort = 3000;
app.listen(devPort, () => {
  console.log(`Listening on Port ${devPort}!`);
});
