/* eslint-disable import/prefer-default-export */
// import Request and Response types from express --> to type req & res objects
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
// middleware to validate user input
import { body } from 'express-validator';

// specific Error subclasses to throw from inside route callback
import validateRequest from 'middlewares/validate-request'
import DatabaseConnectionError from 'errors/database-connection-error';
import User from 'models/user';
import BadRequestError from 'errors/bad-request-error';

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
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const newUser = User.build({ email, password });

    try {
      await newUser.save();
    } catch (err) {
      throw new DatabaseConnectionError();
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt
    };

    // status code 201 === Created
    res.status(201).send({ currentUser: { id: newUser.id, email: newUser.email } });
  });

export { router as signUpRouter };
