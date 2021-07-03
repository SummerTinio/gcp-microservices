/* eslint-disable import/prefer-default-export */
// import Request and Response types from express --> to type req & res objects
import express, { Request, Response } from 'express';

// middleware to validate user input
import { body, validationResult } from 'express-validator';

// specific Error subclasses to throw from inside route callback
import RequestValidationError from '../errors/request-validation-error';
import DatabaseConnectionError from '../errors/database-connection-error';

const router = express.Router();

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'), // error msg if email is invalid
  body('password')
    .trim() // to make sure there are no leading or trailing spaces.
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
],
(req: Request, res: Response) => {
  // get validation result
  const errors = validationResult(req);

  // give user feedback on validation result if errors exist.
  // will NOT work if you simply do "if (errors)"
  // .isEmpty() must be invoked -- it's not just a property.
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  // create a new User on Mongoose
  const { email, password } = req.body;

  console.log('Creating a user...');
  throw new DatabaseConnectionError();

  res.send({ email, password });
});

export { router as signUpRouter };
