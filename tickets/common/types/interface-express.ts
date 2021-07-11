import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserJwtPayload;
    }
  }
}

export interface UserJwtPayload extends jwt.JwtPayload {
  id:  string;
  email: string;
  iat?: number;
}