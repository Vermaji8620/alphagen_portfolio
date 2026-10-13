import {
  Portfolio,
  StrategyProposal,
  SimulationResult,
  FactorExposureItem,
  SectorExposureItem,
  AuditActivityItem
} from '../types/alphagen';

const API_BASE = '/api';

export const api = {
  async getStatus(): Promise<{ connected: boolean; database?: string; message: string }> {
    const res = await fetch(`${API_BASE}/status`);
    return res.json();
  },

  async getPortfolios(): Promise<Portfolio[]> {
    const res = await fetch(`${API_BASE}/portfolios`);
    if (!res.ok) throw new Error('Failed to fetch portfolios from API');
    return res.json();
  },

  async getProposals(): Promise<StrategyProposal[]> {
    const res = await fetch(`${API_BASE}/proposals`);
    if (!res.ok) throw new Error('Failed to fetch proposals from API');
    return res.json();
  },

  async updateProposal(
    id: string,
    status: StrategyProposal['status'],
    decisionMetadata?: StrategyProposal['decisionMetadata']
  ): Promise<StrategyProposal> {
    const res = await fetch(`${API_BASE}/proposals/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, decisionMetadata })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update proposal (${res.status})`);
    }
    return res.json();
  },

  async getSimulations(): Promise<SimulationResult[]> {
    const res = await fetch(`${API_BASE}/simulations`);
    if (!res.ok) throw new Error('Failed to fetch simulations from API');
    return res.json();
  },

  async getFactors(): Promise<Record<string, FactorExposureItem[]>> {
    const res = await fetch(`${API_BASE}/factors`);
    if (!res.ok) throw new Error('Failed to fetch factor exposures from API');
    return res.json();
  },

  async getSectors(): Promise<Record<string, SectorExposureItem[]>> {
    const res = await fetch(`${API_BASE}/sectors`);
    if (!res.ok) throw new Error('Failed to fetch sector exposures from API');
    return res.json();
  },

  async getAuditLogs(): Promise<AuditActivityItem[]> {
    const res = await fetch(`${API_BASE}/audit`);
    if (!res.ok) throw new Error('Failed to fetch audit logs from API');
    return res.json();
  },

  async addAuditLog(logItem: AuditActivityItem): Promise<AuditActivityItem> {
    const res = await fetch(`${API_BASE}/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logItem)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to save audit record (${res.status})`);
    }
    return res.json();
  },

  async resetData(): Promise<void> {
    const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to reset database data');
    }
  }
};
