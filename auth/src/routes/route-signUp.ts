/* eslint-disable import/prefer-default-export */
// import Request and Response types from express --> to type req & res objects
import express, { Request, Response } from 'express';
// middleware to validate user input
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'), // error msg if email is invalid
  body('password')
    .trim() // to make sure there are no leading or trailing spaces.
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be betwewen 4 and 20 characters'),
],
(req: Request, res: Response) => {
  // get validation result
  const errors = validationResult(req);

  // give user feedback on validation result
  if (!errors.isEmpty()) {
    const errorsArray = errors.array(); // turns list of validation errors into an array
    // status code 400 === Bad Request (client error)
    return res.status(400).send(errorsArray);
  }

  // create a new User on Mongoose
  const { email, password } = req.body;

  console.log('Creating a user...');

  res.send({ email, password });
});

export { router as signUpRouter };
