import BadRequestError from 'errors/bad-request-error';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import validateRequest from 'middlewares/validate-request';
import User from 'models/user';
import Password from 'services/password';
import addJwt from 'helpers/jwt-factory';

const router = express.Router();

router.post('/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim() // text sanitization
      .notEmpty()
      .withMessage('You must supply a password')
  ],
  validateRequest, // scoped middleware
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(existingUser.password, password)

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    addJwt(req, existingUser);

    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
