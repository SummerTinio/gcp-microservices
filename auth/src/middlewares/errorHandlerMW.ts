import { Request, Response, NextFunction } from 'express';
import DatabaseConnectionError from '../errors/database-connection-error';
import RequestValidationError from '../errors/request-validation-error';

type structuredError = {
  errors: {
    message: string,
    field?: string,
  }[]
};

const errorHandlerMW = function catchAllErrorHandlingMiddleWare(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // to check if err inherits from our custom Error subclasses
  if (err instanceof RequestValidationError) {
    // logic to handle validation errors (from express-validator)
    const errorArray = err.errors.map((error) => ({ message: error.msg, field: error.param }));

    const formattedError: structuredError = { errors: errorArray };
    // status code 400 === Bad Request (on client)
    return res.status(400).send(formattedError);
  }

  if (err instanceof DatabaseConnectionError) {
    // logic to handle database connection errors (from mongoose)

    // status code 503 === Service Unavailable
    const formattedError: structuredError = { errors: [{ message: err.reason }] };
    return res.status(503).send(formattedError);
  }

  // if error exists,
  // instead of passing error to next middleware or route,
  // stop the request right there!
  res.status(400).send({
    message: 'Something went wrong',
  });

  return next();
};

export default errorHandlerMW;
