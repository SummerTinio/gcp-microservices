// requireAuth scoped middleware -- for protecting confidential routes
// assumes request already passed thru currentUserLogIn.
import { Request, Response, NextFunction } from "express"
import NotAuthorizedError from 'errors/not-authorized-error';

const requireAuth = function requireAuthAfterCurrentUserLogIn(req: Request, res: Response, next: NextFunction) {
  if (!req.currentUser) {
    throw new NotAuthorizedError(); // global error handler MW will take care of res.status().send()
  }
  next();
}

export default requireAuth;