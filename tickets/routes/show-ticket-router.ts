import express, { Request, Response } from 'express';
import body from 'express-validator';

import validateRequest from 'common/middlewares/validate-request';
import requireAuth from 'common/middlewares/require-auth';
import NotFoundError from 'common/errors/not-found-error';
import Ticket from 'models/ticket-mongoose';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const ticket = await Ticket.findById({
    id
  })

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).send(ticket);
})

router.post('/api/tickets', requireAuth, [
  body('title')
    .not()
    .isEmpty() // .escape() ??
    .withMessage('Valid title is required'),
  body('price')
    .not()
    .isEmpty()
    .isFloat()
    .withMessage('Enter a valid price')
], validateRequest, async (req: Request, res: Response) => {
  const { title, price } = req.body;
  
  const ticket = await Ticket.build({
    title,
    price
  })

  res.status(201).send(ticket);
})

export { router as showTicketsRouter };