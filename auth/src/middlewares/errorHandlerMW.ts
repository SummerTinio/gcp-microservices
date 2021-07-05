import { Request, Response, NextFunction } from 'express';
import CustomError from 'errors/custom-error';

const errorHandlerMW = function catchAllErrorHandlingMiddleWare(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // to check if err inherits from abstract class CustomError
  // (reusable way)
  if (err instanceof CustomError) {
    console.log(`caught you in errorHandlerMW! err === ${err}`);
    return res.status(err.statusCode).send({ errors: err.serializeErrors()});
  }

  res.status(400).send({
    errors: [{ message: 'Something went wrong' }]
  });
};

export default errorHandlerMW;
