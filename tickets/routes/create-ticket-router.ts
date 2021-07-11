import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import currentUserLogIn from 'common/middlewares/current-user-login';
import requireAuth from 'common/middlewares/require-auth';
import RequestValidationError from 'common/errors/request-validation-error';
import validateRequest from 'common/middlewares/validate-request';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'), // will set error on request <-- but will not throw an error.
  body('price')
    .isFloat({
      gt: 0
    })
    .withMessage('Price must be greater than 0')
], validateRequest, // <--- this will handle errors from body() from express-validator
  (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { router as createTicketRouter };