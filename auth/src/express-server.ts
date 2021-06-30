import express from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/currentuser', (req, res) => {
  res.send('yo!');
});

const devPort = 3000;
app.listen(devPort, () => {
  console.log(`Listening on Port ${devPort}!`);
});
