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

// import { errorHandlerMW, NotFoundError } from 'common/index';
import errorHandlerMW from 'common/middlewares/errorHandlerMW';
import NotFoundError from 'common/errors/not-found-error';

import { createTicketRouter } from 'routes/create-ticket-router';
import { showTicketRouter } from 'routes/show-ticket-router';
import { indexTicketRouter } from 'routes/index-ticket-router';
import { updateTicketRouter } from 'routes/update-ticket-router';

import currentUserLogIn from 'common/middlewares/current-user-login';

const morgan = require('morgan');

app.set('trust proxy', true); // traffic is being proxied THRU nginx. need to make express aware it's behind a proxy
app.use(json());
app.use(morgan('dev'));

// import all express routers & use as middleware
// app.use(currentUserRouter);
// ### ROUTERS THAT DO NOT REQUIRE AUTH ###
app.use(showTicketRouter);
app.use(indexTicketRouter);

app.use(currentUserLogIn); // only add this after cookieSession has been set, and only before secure/protected routes
// ### ROUTERS THAT REQUIRE AUTH ###
app.use(createTicketRouter);
app.use(updateTicketRouter);
// catch-all error-handling middleware to enforce consistency across the board
app.use(errorHandlerMW);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

export default { app };