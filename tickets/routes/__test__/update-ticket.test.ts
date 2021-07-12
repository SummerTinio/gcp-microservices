import request from 'supertest';
import mongoose from 'mongoose';

import { app } from 'express-server';
import Ticket from 'models/ticket-mongoose';

it('returns a 404 if provided ticket id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  
  await request(app)
  .put(`/api/tickets/${id}`)
  .set('Cookie', global.signin())
  .send({
    title: 'ngek',
    price: 20
  })
  .expect(404);
  
});

it('returns a 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  
  await request(app)
  .put(`/api/tickets/${id}`)
  .send({
    title: 'ngek',
    price: 20
  })
  .expect(401);
  
});

it('returns a 401 if tries to edit ticket that they do not own', async () => {
  const response1 = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'test1',
      price: 20
    });

  const response2 = await request(app)
    .put(`/api/tickets/${response1.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'test1 update!',
      price: 90
    })
    .expect(401)

    const originalTicket = await Ticket.findById({ id: response1.body.id });
    expect(originalTicket.title).toEqual(response1.body.title);

});

it('returns a 400 if user enters invalid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'yay this is valid',
      price: 10
    })
    
    await request(app)
    .post(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'no not valid!!',
      price: -1
    })
    .expect(400)

    await request(app)
    .post(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10
    })
    .expect(400)
    
  });
  
  it('returns a 401 if user does NOT own the ticket', async () => {
    const cookie = global.signin();
  
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'yay this is valid',
        price: 10
      })

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'new title',
        price: 40
      })
      .expect(200);

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send()

    expect(ticketResponse.body.title).toEqual('new title');
    expect(ticketResponse.body.price).toEqual(40);
    
  });
 