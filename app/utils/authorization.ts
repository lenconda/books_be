import jwt from 'jsonwebtoken';
import config from '../config';
import { UnauthorizedError } from 'routing-controllers';

export const generateToken = (payload: any, regenerate = false): string => {
  return jwt.sign(
    payload,
    'books',
    (config.isDev || regenerate) ? null : { expiresIn: '600000' });
};

export const regenerateToken = (token: string): string => {
  const payload = jwt.verify(token, 'books');
  return generateToken(payload, true);
};

export const getUserIDByToken = (raw: string): any => {
  try {
    const token = raw.substring(7) || '';
    const decoded = jwt.verify(token, 'books');
    return decoded;
  } catch (e) {
    throw new UnauthorizedError(e.message);
  }
};

export const validateToken = (raw: string): boolean => {
  try {
    const token = raw.substring(7) || '';
    jwt.verify(token, 'books');
    return true;
  } catch (e) {
    return false;
  }
};
