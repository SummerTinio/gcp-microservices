import { Request, Response, NextFunction } from 'express';
import CustomError from '../errors/custom-error';

const errorHandlerMW = function catchAllErrorHandlingMiddleWare(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // to check if err inherits from abstract class CustomError
  // (reusable way)
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send(err.serializeErrors());
  }

  return next();
};

export default errorHandlerMW;
