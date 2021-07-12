import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import validateRequest from 'common/middlewares/validate-request';
import requireAuth from 'common/middlewares/require-auth';

import NotFoundError from 'common/errors/not-found-error';
import NotAuthorizedError from 'common/errors/not-authorized-error';

import Ticket from 'models/ticket-mongoose';

const router = express.Router();

router.put('/api/tickets/:id',
  requireAuth, [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .not()
    .isEmpty()
    .withMessage('Price is required and must be greater than 0.')
], validateRequest, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, price } = req.body;

  const ticket = await Ticket.findById({ id });

  if (!ticket) {
    throw new NotFoundError();
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  // finally, update if all validation, auth passes.
  ticket.set({
    title,
    price
  });

  await ticket.save()

  res.send(ticket);

});

export { router as updateTicketRouter };