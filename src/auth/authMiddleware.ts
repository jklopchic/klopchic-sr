import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';

dotenv.config();

export const checkJwt = auth({
  audience: `${process.env.AUTH0_DOMAIN}/api/v2/`,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: 'RS256'
}); 