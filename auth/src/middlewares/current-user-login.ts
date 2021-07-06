// middleware whose sole responsibility is
// to assign req.currentUser = plaintextJwtPayload
// if request already contains a req.session.jwt. if none, pass request to next() MW

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cookieSession from 'cookie-session';

import BadRequestError from 'errors/bad-request-error';
import { UserJwtPayload } from 'types/interface-express';

// if you're logged in, set req.currentUser === jwt payload
//  jwt payload contains id, email in plaintext
const currentUserLogIn = function attachJwtPayloadToReqCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //  if  not logged in, pass req onto next middleware.
  if (!req.session?.jwt) {
    return next();
  }

  // if they ARE logged  in, set req.currentUser === jwt payload
  try {
    const plaintextPayload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserJwtPayload;

    req.currentUser = plaintextPayload;

  } catch (err) {
    console.error(`error! caught u in current-user.login.ts.  err === ${err}`);
    next(err);
  }

  return next();
}

export default currentUserLogIn;