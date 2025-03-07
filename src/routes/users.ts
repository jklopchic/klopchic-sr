import { Router, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const createUser: RequestHandler = async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    const { email, name } = req.body;
    const user = await prisma.user.create({
      data: {
        email,
        name,
        auth0Id: req.oidc.user?.sub,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user' });
  }
};

const getUsers: RequestHandler = async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

router.post('/', createUser);
router.get('/', getUsers);

export default router; 