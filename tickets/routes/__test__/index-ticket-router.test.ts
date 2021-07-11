import request from 'supertest';
import { app } from 'express-server';

// don't await it here -- await it in the test itself.
const createTicket = () => {
  const response = request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'loco concert',
      price: 22
    })

  return response;
};

it('can fetch a list of tickets, no auth needed', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app)
    .post('/api/tickets')
    .send()
    .expect(200);
  
  expect(response.body.length).toEqual(3);
});

it('', async () => {

});

it('', async () => {

});

it('', async () => {

});

it('', async () => {

});

it('', async () => {

});

