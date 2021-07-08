import request from 'supertest';
import app from '../../express-server';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'jakesim@test.com',
      password: 'haha'
    })
    .expect(201)
})

// send fake request to /api/users/
// input email, password in req.body