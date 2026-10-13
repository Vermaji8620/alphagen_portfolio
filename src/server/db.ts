import dns from 'node:dns';
import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

// Configure DNS to resolve MongoDB Atlas SRV records (mongodb+srv://)
// Fixes querySrv ECONNREFUSED on Windows and restrictive ISP DNS servers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in environments where setServers is restricted
}

import {
  INITIAL_PORTFOLIOS,
  INITIAL_PROPOSALS,
  INITIAL_SIMULATIONS,
  INITIAL_FACTOR_EXPOSURES,
  INITIAL_SECTORS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

dotenv.config();

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.DB_NAME || 'alphagen_db';

let client: MongoClient | null = null;
let dbInstance: Db | null = null;

export async function connectToDatabase(): Promise<{ db: Db; isConnected: boolean }> {
  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment variables.');
  }

  if (dbInstance) {
    return { db: dbInstance, isConnected: true };
  }

  client = new MongoClient(uri);
  await client.connect();
  dbInstance = client.db(dbName);
  console.log(`[MongoDB] Connected to database: ${dbName}`);

  // Seed default data if collections are empty (idempotent, no duplicates)
  await seedDatabaseIfEmpty(dbInstance);

  return { db: dbInstance, isConnected: true };
}

export function getDatabase(): Db | null {
  return dbInstance;
}

export async function seedDatabaseIfEmpty(db: Db): Promise<void> {
  const portfoliosCol = db.collection('portfolios');
  const proposalsCol = db.collection('proposals');
  const simulationsCol = db.collection('simulations');
  const factorsCol = db.collection('factorExposures');
  const sectorsCol = db.collection('sectorExposures');
  const auditLogsCol = db.collection('auditLogs');

  const portfolioCount = await portfoliosCol.countDocuments();
  if (portfolioCount === 0) {
    console.log('[MongoDB Seed] Seeding initial portfolios...');
    await portfoliosCol.insertMany(INITIAL_PORTFOLIOS.map(p => ({ ...p })));
  }

  const proposalCount = await proposalsCol.countDocuments();
  if (proposalCount === 0) {
    console.log('[MongoDB Seed] Seeding initial strategy proposals...');
    await proposalsCol.insertMany(INITIAL_PROPOSALS.map(p => ({ ...p })));
  }

  const simCount = await simulationsCol.countDocuments();
  if (simCount === 0) {
    console.log('[MongoDB Seed] Seeding initial simulations...');
    await simulationsCol.insertMany(INITIAL_SIMULATIONS.map(s => ({ ...s })));
  }

  const factorCount = await factorsCol.countDocuments();
  if (factorCount === 0) {
    console.log('[MongoDB Seed] Seeding initial factor exposures...');
    const factorDocs = Object.entries(INITIAL_FACTOR_EXPOSURES).map(([portfolioId, items]) => ({
      portfolioId,
      items
    }));
    await factorsCol.insertMany(factorDocs);
  }

  const sectorCount = await sectorsCol.countDocuments();
  if (sectorCount === 0) {
    console.log('[MongoDB Seed] Seeding initial sector exposures...');
    const sectorDocs = Object.entries(INITIAL_SECTORS).map(([portfolioId, items]) => ({
      portfolioId,
      items
    }));
    await sectorsCol.insertMany(sectorDocs);
  }

  const auditCount = await auditLogsCol.countDocuments();
  if (auditCount === 0) {
    console.log('[MongoDB Seed] Seeding initial audit history...');
    await auditLogsCol.insertMany(INITIAL_AUDIT_LOGS.map(a => ({ ...a })));
  }
}

export async function resetDatabase(db: Db): Promise<void> {
  await db.collection('portfolios').deleteMany({});
  await db.collection('proposals').deleteMany({});
  await db.collection('simulations').deleteMany({});
  await db.collection('factorExposures').deleteMany({});
  await db.collection('sectorExposures').deleteMany({});
  await db.collection('auditLogs').deleteMany({});

  await seedDatabaseIfEmpty(db);
}
