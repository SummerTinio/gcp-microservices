import request from 'supertest';
import mongoose from 'mongoose';

import { app } from 'express-server';


it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/tickets/gibberish${id}`)
    .send()
    .expect(404)
});

it('returns the ticket if ticket is found', async () => {
  const title = 'conciertolanini';
  const price = 55;

  const response = await request(app) // will contain the id of the created id
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});