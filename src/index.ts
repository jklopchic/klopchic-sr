import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { auth } from 'express-openid-connect';
import cardRoutes from './routes/cards';
import userRoutes from './routes/users';
import collectionRoutes from './routes/collection';

dotenv.config();

const app = express();
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

// Routes
app.use('/card', cardRoutes);
app.use('/users', userRoutes);
app.use('/collection', collectionRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});