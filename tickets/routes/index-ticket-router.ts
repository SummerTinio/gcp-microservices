import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import Tickets from 'models/tickets-mongoose';

const router = express.Router();

router.post('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Tickets.find({}); 
  
  res.send(tickets);
});
 
export { router as indexTicketRouter }