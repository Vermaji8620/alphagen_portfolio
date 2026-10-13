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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

// Health & DB Connection Status Endpoint
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

// GET /api/portfolios
app.get('/api/portfolios', async (req: Request, res: Response) => {
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

// GET /api/proposals
app.get('/api/proposals', async (req: Request, res: Response) => {
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

// PATCH /api/proposals/:id
app.patch('/api/proposals/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, decisionMetadata } = req.body;

    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: 'Database not connected. Please configure MongoDB URI.' });
    }

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (decisionMetadata) updateFields.decisionMetadata = decisionMetadata;

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

// GET /api/simulations
app.get('/api/simulations', async (req: Request, res: Response) => {
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

// GET /api/factors
app.get('/api/factors', async (req: Request, res: Response) => {
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

// GET /api/sectors
app.get('/api/sectors', async (req: Request, res: Response) => {
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

// GET /api/audit
app.get('/api/audit', async (req: Request, res: Response) => {
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

// POST /api/audit
app.post('/api/audit', async (req: Request, res: Response) => {
  try {
    const logItem = req.body;
    if (!logItem || !logItem.id) {
      return res.status(400).json({ error: 'Invalid audit log item' });
    }

    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: 'Database not connected. Please configure MongoDB URI.' });
    }

    await db.collection('auditLogs').insertOne({ ...logItem });
    return res.status(201).json(logItem);
  } catch (err: any) {
    console.error('Error inserting audit log:', err);
    return res.status(500).json({ error: 'Failed to record audit log' });
  }
});

// POST /api/reset
app.post('/api/reset', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: 'Database not connected.' });
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
