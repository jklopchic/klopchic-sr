import express, { Request, Response, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { auth } from 'express-openid-connect';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`
};

// auth router attaches /login, /logout, and /callback routes
app.use(auth(config));

app.use(express.json());

// Basic health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Home page with login status
app.get('/', (req: Request, res: Response) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Protected user routes
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

app.post('/users', createUser);
app.get('/users', getUsers);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});