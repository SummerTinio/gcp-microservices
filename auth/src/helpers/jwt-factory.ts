import { Request } from 'express';
import jwt from 'jsonwebtoken';
import cookieSession from 'cookie-session';

import { UserDoc } from 'types/interface-mongoose';

const addJwt = function addJwtToReqSession(req: Request, normalizedUserDoc: UserDoc) {
  // Generate JWT
  const userJwt = jwt.sign(
    {
      id: normalizedUserDoc.id,
      email: normalizedUserDoc.email,
    },
    process.env.JWT_KEY!,
  )

  // store JWT on cookie (session object from cookie-session)
  // Store it on the session object
  // TS gets angry if u do "req.session.jwt = userJwt;" -- instead:
  // redefine the entire req.session property!
  req.session = {
    jwt: userJwt
  };

  return req;
}

export default addJwt;