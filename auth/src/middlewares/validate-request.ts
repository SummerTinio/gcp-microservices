import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import RequestValidationError from 'errors/request-validation-error';
require('express-async-errors');

const validateRequest = function validateReqBody(req: Request, res: Response, next: NextFunction) {
  // get result of validation
  const errors = validationResult(req);

  // give user feedback on validation result if errors exist.
  // will NOT work if you simply do "if (errors)"
  // .isEmpty() must be invoked -- it's not just a property.
  if (!errors.isEmpty()) {
    const errorsArray = errors.array();
    throw new RequestValidationError(errorsArray);
  }

  next();
};

export default validateRequest;