import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../types/alphagen';

const JWT_SECRET = process.env.JWT_SECRET || 'alphagen_institutional_jwt_secret_dev_2024';

export interface AuthJwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthJwtPayload;
}

export function generateToken(payload: AuthJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AuthJwtPayload {
  return jwt.verify(token, JWT_SECRET) as AuthJwtPayload;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Invalid or expired session token. Please log in again.' });
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Action restricted to: ${allowedRoles.join(', ')}. Current role: ${req.user.role}`
      });
    }
    next();
  };
}
