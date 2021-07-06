import express, { Request, Response } from 'express';
import cookieSession from 'cookie-session';
import jwt from 'jsonwebtoken';
require('express-async-errors');

import currentUserLogIn from 'middlewares/current-user-login';
import { UserJwtPayload } from 'types/interface-express';

const router = express.Router();

router.get('/api/users/currentuser', currentUserLogIn, (req: Request, res: Response) => {
  // currentUserLogIn scoped middleware already modified  req.currentUser by this time,
  // so u can reference it if it exists.
  res.send({ currentUser: req.currentUser || null });
  
});

export { router as currentUserRouter };
