// signOut === basically just send a header
// to tell browsers to dump all jwt info of that user.
import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/users/signout', (req: Request, res: Response) => {
  req.session = null;
  res.send({ currentUser: null });
});

export { router as signOutRouter };
