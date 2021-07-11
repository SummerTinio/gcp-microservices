import request from 'supertest';
import { app } from 'express-server';
import Ticket from 'models/ticket-mongoose';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
  // const response = await request(app)
    await request(app)  
    .post('/api/tickets')
    .send({})
    .expect(401);

  // or expect(response.status).toEqual(401); 
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})
   
  expect(response.status).not.toEqual(401);
});

it('returns an error if invalid ticket title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10
    })
    .expect(400);
  
});

it('returns an error if invalid ticket price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'validtitle',
      price: '20' 
    })
    .expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'validtitle',
      price: -10 
    })
    .expect(400);
  
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'validtitle',
      price: -10 
    })
    .expect(400);
  
});

it('creates a ticket with valid inputs', async () => {
  // add in check for db -- to make sure ticket was created. 
  
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'fever',
      price: 50
    })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  
  expect(tickets[0].title).toEqual('fever');
  expect(tickets[0].price).toEqual(50);
});

