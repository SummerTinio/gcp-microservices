declare global {
  namespace Express {
    interface Request {
      currentUser?: UserJwtPayload;
    }
  }
}

export interface UserJwtPayload {
  id:  string;
  email: string;
}