import express from 'express';
import { checkJwt } from './authMiddleware';

const router = express.Router();

// Public route - no authentication required
router.get('/public', (req, res) => {
  res.json({ message: 'This is a public endpoint' });
});

// Protected route - requires authentication
router.get('/protected', checkJwt, (req, res) => {
  res.json({ 
    message: 'This is a protected endpoint',
    user: req.auth?.payload
  });
});

export default router; 