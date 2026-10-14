import {
  Portfolio,
  StrategyProposal,
  SimulationResult,
  FactorExposureItem,
  SectorExposureItem,
  AuditActivityItem,
  UserProfile
} from '../types/alphagen';

const API_BASE = '/api';
const TOKEN_KEY = 'alphagen_jwt_token';

let onUnauthorizedHandler: (() => void) | null = null;

export function setOnUnauthorizedCallback(handler: () => void) {
  onUnauthorizedHandler = handler;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Session token expired or invalid
    setAuthToken(null);
    if (onUnauthorizedHandler) {
      onUnauthorizedHandler();
    }
  }

  return response;
}

export const api = {
  // Auth API
  async login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Login failed (${res.status})`);
    }
    const data = await res.json();
    setAuthToken(data.token);
    return data;
  },

  async getMe(): Promise<UserProfile> {
    const res = await authFetch(`${API_BASE}/auth/me`);
    if (!res.ok) {
      throw new Error('Unauthorized or session expired');
    }
    const data = await res.json();
    return data.user;
  },

  async getSeededAccounts(): Promise<Array<{
    name: string;
    email: string;
    role: string;
    title: string;
    department: string;
    defaultPassword: string;
  }>> {
    const res = await fetch(`${API_BASE}/auth/seeded-accounts`);
    if (!res.ok) return [];
    return res.json();
  },

  async getStatus(): Promise<{ connected: boolean; database?: string; message: string }> {
    const res = await fetch(`${API_BASE}/status`);
    return res.json();
  },

  async getPortfolios(): Promise<Portfolio[]> {
    const res = await authFetch(`${API_BASE}/portfolios`);
    if (!res.ok) throw new Error('Failed to fetch portfolios from API');
    return res.json();
  },

  async depositFunds(portfolioId: string, amount: number): Promise<Portfolio> {
    const res = await authFetch(`${API_BASE}/portfolios/${encodeURIComponent(portfolioId)}/deposit`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to deposit funds (${res.status})`);
    }
    return res.json();
  },

  async getProposals(): Promise<StrategyProposal[]> {
    const res = await authFetch(`${API_BASE}/proposals`);
    if (!res.ok) throw new Error('Failed to fetch proposals from API');
    return res.json();
  },

  async updateProposal(
    id: string,
    status: StrategyProposal['status'],
    notes?: string
  ): Promise<StrategyProposal> {
    const res = await authFetch(`${API_BASE}/proposals/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update proposal (${res.status})`);
    }
    return res.json();
  },

  async getSimulations(): Promise<SimulationResult[]> {
    const res = await authFetch(`${API_BASE}/simulations`);
    if (!res.ok) throw new Error('Failed to fetch simulations from API');
    return res.json();
  },

  async getFactors(): Promise<Record<string, FactorExposureItem[]>> {
    const res = await authFetch(`${API_BASE}/factors`);
    if (!res.ok) throw new Error('Failed to fetch factor exposures from API');
    return res.json();
  },

  async getSectors(): Promise<Record<string, SectorExposureItem[]>> {
    const res = await authFetch(`${API_BASE}/sectors`);
    if (!res.ok) throw new Error('Failed to fetch sector exposures from API');
    return res.json();
  },

  async getAuditLogs(): Promise<AuditActivityItem[]> {
    const res = await authFetch(`${API_BASE}/audit`);
    if (!res.ok) throw new Error('Failed to fetch audit logs from API');
    return res.json();
  },

  async addAuditLog(logItem: AuditActivityItem): Promise<AuditActivityItem> {
    const res = await authFetch(`${API_BASE}/audit`, {
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
    const res = await authFetch(`${API_BASE}/reset`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to reset database data');
    }
  }
};
