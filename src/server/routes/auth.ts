import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getDatabase } from '../db';
import { SEEDED_USERS, DEFAULT_PASSWORD_PLAIN } from '../users';
import { generateToken, requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { UserProfile } from '../../types/alphagen';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let matchedUser: any = null;

    const db = getDatabase();
    if (db) {
      matchedUser = await db.collection('users').findOne({ email: normalizedEmail });
    }

    // Fallback to seeded users if db is offline or user not yet migrated
    if (!matchedUser) {
      matchedUser = SEEDED_USERS.find(u => u.email.toLowerCase() === normalizedEmail);
    }

    if (!matchedUser) {
      return res.status(401).json({ error: 'Invalid credentials. Unknown user account.' });
    }

    // Validate password using bcrypt
    const passwordValid = await bcrypt.compare(password, matchedUser.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials. Incorrect password.' });
    }

    const tokenPayload = {
      userId: matchedUser.id,
      email: matchedUser.email,
      role: matchedUser.role,
      name: matchedUser.name
    };

    const token = generateToken(tokenPayload);

    const userProfile: UserProfile = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      title: matchedUser.title,
      department: matchedUser.department
    };

    return res.json({
      token,
      user: userProfile
    });
  } catch (err: any) {
    console.error('[Auth Error] /api/auth/login:', err);
    return res.status(500).json({ error: 'Authentication service error.' });
  }
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userPayload = req.user!;
    let profile: any = null;

    const db = getDatabase();
    if (db) {
      profile = await db.collection('users').findOne(
        { id: userPayload.userId },
        { projection: { passwordHash: 0, _id: 0 } }
      );
    }

    if (!profile) {
      const seeded = SEEDED_USERS.find(u => u.id === userPayload.userId);
      if (seeded) {
        profile = {
          id: seeded.id,
          name: seeded.name,
          email: seeded.email,
          role: seeded.role,
          title: seeded.title,
          department: seeded.department
        };
      }
    }

    if (!profile) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ user: profile });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

// GET /api/auth/seeded-accounts (Helper for demo one-click logins)
authRouter.get('/seeded-accounts', (req: Request, res: Response) => {
  const accounts = SEEDED_USERS.map(u => ({
    name: u.name,
    email: u.email,
    role: u.role,
    title: u.title,
    department: u.department,
    defaultPassword: DEFAULT_PASSWORD_PLAIN
  }));
  res.json(accounts);
});
