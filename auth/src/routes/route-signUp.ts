/* eslint-disable import/prefer-default-export */
// import Request and Response types from express --> to type req & res objects
import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/users/signup', (req: Request, res: Response) => {
  const { email, password } = req.body;

  // create a new User on Mongoose

  res.send('signing up!');
});

export { router as signUpRouter };
