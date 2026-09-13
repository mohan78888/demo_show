import { OAuth2Client } from 'google-auth-library';
import env from '../config/env.js';
import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';

const getGoogleClientId = (): string => {
  const clientId = env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new AppError('GOOGLE_CLIENT_ID is not configured on the server.', 500);
  }
  return clientId;
};

export interface GoogleUserData {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  emailVerified: boolean;
}

/**
 * Verifies a Google ID Token sent from the frontend popup login.
 * Validates audience, issuer, signature, expiry, and email verification status.
 */
export const verifyGoogleIdToken = async (idToken: string): Promise<GoogleUserData> => {
  try {
    if (!idToken) {
      throw new AppError('Google ID token is required.', 400);
    }

    const clientId = getGoogleClientId();
    const client = new OAuth2Client(clientId);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new AppError('Invalid Google token payload.', 401);
    }

    if (!payload.email) {
      throw new AppError('Google account does not have an associated email.', 400);
    }

    if (!payload.email_verified) {
      throw new AppError('Google email is not verified.', 401);
    }

    return {
      googleId: payload.sub,
      email: payload.email.toLowerCase().trim(),
      firstName: payload.given_name || payload.name?.split(' ')[0] || 'GoogleUser',
      lastName: payload.family_name || payload.name?.split(' ').slice(1).join(' ') || '',
      picture: payload.picture || '',
      emailVerified: Boolean(payload.email_verified),
    };
  } catch (error: any) {
    logger.error(`[Google ID Token Verification Error]: ${error?.message || error}`);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(error?.message || 'Invalid or expired Google ID token.', 401);
  }
};
