import express, { Request, Response } from 'express';
import cookieSession from 'cookie-session';
import jwt from 'jsonwebtoken';
require('express-async-errors');

import currentUserLogIn from 'middlewares/current-user-login';

const router = express.Router();

router.get('/api/users/currentuser', currentUserLogIn, (req: Request, res: Response) => {
  // if no req.session exists (i.e. did not go thru cookieSession() middleware
  // or if JWT token has NOT been set on cookie-session,
  if (!req.session?.jwt) {// same as if (!req.session || !req.session.jwt)
    // return early with { currentUser: null }
    return res.send({ currentUser: null });
  }

  // if JWT token EXISTS on req.session.jwt
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    );
    res.send({ currentUser: payload })
  } catch (err) {
    console.error(err);
    res.send({ currentUser: null });
  };

});

export { router as currentUserRouter };
