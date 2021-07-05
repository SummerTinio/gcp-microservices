import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cookieSession from 'cookie-session';

import BadRequestError from '../errors/bad-request-error';
import { UserJwtPayload } from '../models/interface-express';

// if you're logged in, set req.currentUser === jwt payload
//  jwt payload contains id, email in plaintext
const currentUserLogIn = function attachJwtToReqCurrentUser(
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
    const payload = (jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    )) as UserJwtPayload;

    req.currentUser = payload;

  } catch (err) {
    throw new BadRequestError('Invalid session');
  }

  return next();
}

export default currentUserLogIn;