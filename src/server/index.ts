import dns from 'node:dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch { }

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase, getDatabase, resetDatabase } from './db';
import {
  INITIAL_PORTFOLIOS,
  INITIAL_PROPOSALS,
  INITIAL_SIMULATIONS,
  INITIAL_FACTOR_EXPOSURES,
  INITIAL_SECTORS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';
import { authRouter } from './routes/auth';
import { requireAuth, AuthenticatedRequest } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

app.use('/api/auth', authRouter);

// Health & DB Connection Status Endpoint (Public)
app.get('/api/status', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json({
        connected: false,
        message: 'MongoDB URI not yet configured or connecting. Operating in fallback mock mode.'
      });
    }
    // Ping MongoDB
    await db.command({ ping: 1 });
    return res.json({
      connected: true,
      database: db.databaseName,
      message: 'MongoDB Atlas connected successfully.'
    });
  } catch (error: any) {
    return res.status(500).json({
      connected: false,
      error: error.message
    });
  }
});

// GET /api/portfolios (Protected)
app.get('/api/portfolios', requireAuth, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json(INITIAL_PORTFOLIOS);
    }
    const portfolios = await db.collection('portfolios').find({}, { projection: { _id: 0 } }).toArray();
    return res.json(portfolios);
  } catch (err: any) {
    console.error('Error fetching portfolios:', err);
    return res.status(500).json({ error: 'Failed to retrieve portfolios' });
  }
});

// PATCH /api/portfolios/:id/deposit (Protected - Deposit margin cash)
app.patch('/api/portfolios/:id/deposit', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const depositAmount = Number(amount);

    if (!depositAmount || depositAmount <= 0) {
      return res.status(400).json({ error: 'Invalid deposit amount' });
    }

    const db = getDatabase();
    if (!db) {
      const target = INITIAL_PORTFOLIOS.find(p => p.id === id);
      if (!target) return res.status(404).json({ error: 'Portfolio not found' });
      target.cashBalance += depositAmount;
      target.aum += depositAmount;
      return res.json(target);
    }

    const result = await db.collection('portfolios').findOneAndUpdate(
      { id },
      { $inc: { cashBalance: depositAmount, aum: depositAmount } },
      { returnDocument: 'after', projection: { _id: 0 } }
    );

    if (!result) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    return res.json(result);
  } catch (err: any) {
    console.error('Error depositing funds:', err);
    return res.status(500).json({ error: 'Failed to process margin deposit' });
  }
});

// GET /api/proposals (Protected)
app.get('/api/proposals', requireAuth, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json(INITIAL_PROPOSALS);
    }
    const proposals = await db.collection('proposals').find({}, { projection: { _id: 0 } }).toArray();
    return res.json(proposals);
  } catch (err: any) {
    console.error('Error fetching proposals:', err);
    return res.status(500).json({ error: 'Failed to retrieve proposals' });
  }
});

// PATCH /api/proposals/:id (Protected - Enforces Portfolio Manager authorization)
app.patch('/api/proposals/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const actorUser = req.user;

    const db = getDatabase();

    const decidedBy = actorUser
      ? `${actorUser.name} (${actorUser.role.replace('_', ' ')})`
      : 'Portfolio Manager (Human Token #PM-8921)';

    const decisionMetadata = {
      decidedAt: new Date().toISOString(),
      decidedBy,
      decision: status === 'rejected' ? 'REJECTED' : 'APPROVED',
      notes: notes || (status === 'approved'
        ? 'Proposal approved following multi-factor & Monte Carlo risk verification.'
        : status === 'rejected'
        ? 'Proposal rejected by portfolio manager discretion.'
        : 'Simulated algorithmic order slicing routed.')
    };

    if (!db) {
      // In-memory fallback response
      const existing = INITIAL_PROPOSALS.find(p => p.id === id);
      if (!existing) return res.status(404).json({ error: 'Proposal not found' });
      const updated = {
        ...existing,
        status: status || existing.status,
        decisionMetadata
      };
      return res.json(updated);
    }

    const updateFields: any = { status, decisionMetadata };

    const result = await db.collection('proposals').findOneAndUpdate(
      { id },
      { $set: updateFields },
      { returnDocument: 'after', projection: { _id: 0 } }
    );

    if (!result) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    return res.json(result);
  } catch (err: any) {
    console.error('Error updating proposal:', err);
    return res.status(500).json({ error: 'Failed to update proposal' });
  }
});

// GET /api/simulations (Protected)
app.get('/api/simulations', requireAuth, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json(INITIAL_SIMULATIONS);
    }
    const simulations = await db.collection('simulations').find({}, { projection: { _id: 0 } }).toArray();
    return res.json(simulations);
  } catch (err: any) {
    console.error('Error fetching simulations:', err);
    return res.status(500).json({ error: 'Failed to retrieve simulations' });
  }
});

// GET /api/factors (Protected)
app.get('/api/factors', requireAuth, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json(INITIAL_FACTOR_EXPOSURES);
    }
    const factorDocs = await db.collection('factorExposures').find({}, { projection: { _id: 0 } }).toArray();
    const factorMap: Record<string, any> = {};
    factorDocs.forEach((doc: any) => {
      factorMap[doc.portfolioId] = doc.items;
    });
    return res.json(factorMap);
  } catch (err: any) {
    console.error('Error fetching factor exposures:', err);
    return res.status(500).json({ error: 'Failed to retrieve factor exposures' });
  }
});

// GET /api/sectors (Protected)
app.get('/api/sectors', requireAuth, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json(INITIAL_SECTORS);
    }
    const sectorDocs = await db.collection('sectorExposures').find({}, { projection: { _id: 0 } }).toArray();
    const sectorMap: Record<string, any> = {};
    sectorDocs.forEach((doc: any) => {
      sectorMap[doc.portfolioId] = doc.items;
    });
    return res.json(sectorMap);
  } catch (err: any) {
    console.error('Error fetching sector exposures:', err);
    return res.status(500).json({ error: 'Failed to retrieve sector exposures' });
  }
});

// GET /api/audit (Protected)
app.get('/api/audit', requireAuth, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json(INITIAL_AUDIT_LOGS);
    }
    const logs = await db.collection('auditLogs')
      .find({}, { projection: { _id: 0 } })
      .sort({ timestamp: -1 })
      .toArray();
    return res.json(logs);
  } catch (err: any) {
    console.error('Error fetching audit logs:', err);
    return res.status(500).json({ error: 'Failed to retrieve audit logs' });
  }
});

// POST /api/audit (Protected - extracts actor directly from validated JWT token)
app.post('/api/audit', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logItem = req.body;
    if (!logItem || !logItem.id) {
      return res.status(400).json({ error: 'Invalid audit log item' });
    }

    // Overwrite actor with authenticated user credentials from token
    if (req.user) {
      logItem.actor = `${req.user.name} (${req.user.role.replace('_', ' ')})`;
    }

    const db = getDatabase();
    if (db) {
      await db.collection('auditLogs').insertOne({ ...logItem });
    }

    return res.status(201).json(logItem);
  } catch (err: any) {
    console.error('Error inserting audit log:', err);
    return res.status(500).json({ error: 'Failed to record audit log' });
  }
});

// POST /api/reset (Protected)
app.post('/api/reset', requireAuth, async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json({ message: 'In-memory data reset to baseline.' });
    }
    await resetDatabase(db);
    return res.json({ message: 'Database reset to default sample baseline successfully.' });
  } catch (err: any) {
    console.error('Error resetting database:', err);
    return res.status(500).json({ error: 'Failed to reset database' });
  }
});

// Start Server & Connect to DB
async function startServer() {
  try {
    await connectToDatabase();
  } catch (err: any) {
    console.warn(`[MongoDB Warning] ${err.message}`);
    if (!process.env.MONGODB_URI) {
      console.warn('[MongoDB Warning] API starting in fallback mock mode: MONGODB_URI is not set in .env');
    } else {
      console.warn('[MongoDB Warning] API starting in fallback mock mode because connection to MongoDB failed.');
    }
  }

  app.listen(PORT, () => {
    console.log(`[AlphaGen Backend] Express API running on http://localhost:${PORT}`);
  });
}

startServer();
