/* eslint-disable import/prefer-default-export */
// import Request and Response types from express --> to type req & res objects
import express, { Request, Response } from 'express';
// middleware to validate user input
import { body } from 'express-validator';

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
  const { email, password } = req.body;

  // create a new User on Mongoose

  res.send('signing up!');
});

export { router as signUpRouter };
