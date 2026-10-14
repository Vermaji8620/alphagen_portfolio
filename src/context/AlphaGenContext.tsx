import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Portfolio,
  StrategyProposal,
  SimulationResult,
  FactorExposureItem,
  SectorExposureItem,
  AuditActivityItem
} from '../types/alphagen';
import {
  INITIAL_PORTFOLIOS,
  INITIAL_PROPOSALS,
  INITIAL_SIMULATIONS,
  INITIAL_FACTOR_EXPOSURES,
  INITIAL_SECTORS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface AlphaGenContextType {
  portfolios: Portfolio[];
  selectedPortfolioId: string;
  selectedPortfolio: Portfolio;
  setSelectedPortfolioId: (id: string) => void;
  proposals: StrategyProposal[];
  simulations: SimulationResult[];
  auditLogs: AuditActivityItem[];
  factorExposures: Record<string, FactorExposureItem[]>;
  sectorExposures: Record<string, SectorExposureItem[]>;
  isLoading: boolean;
  dbConnected: boolean;
  apiError: string | null;
  clearApiError: () => void;
  reloadAllData: () => Promise<void>;
  
  // Actions
  approveProposal: (id: string, notes?: string) => Promise<void>;
  rejectProposal: (id: string, notes?: string) => Promise<void>;
  simulateExecuteProposal: (id: string) => Promise<void>;
  depositFunds: (portfolioId: string, amount: number, paymentMethod: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  
  // Quick lookup
  getSimulationById: (simId: string) => SimulationResult | undefined;
  getProposalById: (propId: string) => StrategyProposal | undefined;
}

// UI Preference Storage Only
const STORAGE_KEY_PORTFOLIO_ID = 'alphagen_ui_selected_portfolio_v1';

const AlphaGenContext = createContext<AlphaGenContextType | undefined>(undefined);

export const AlphaGenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>(INITIAL_PORTFOLIOS);
  
  const [selectedPortfolioId, setSelectedPortfolioIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PORTFOLIO_ID);
    return saved && INITIAL_PORTFOLIOS.some(p => p.id === saved) ? saved : INITIAL_PORTFOLIOS[0].id;
  });

  const [proposals, setProposals] = useState<StrategyProposal[]>(INITIAL_PROPOSALS);
  const [auditLogs, setAuditLogs] = useState<AuditActivityItem[]>(INITIAL_AUDIT_LOGS);
  const [simulations, setSimulations] = useState<SimulationResult[]>(INITIAL_SIMULATIONS);
  const [factorExposures, setFactorExposures] = useState(INITIAL_FACTOR_EXPOSURES);
  const [sectorExposures, setSectorExposures] = useState(INITIAL_SECTORS);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbConnected, setDbConnected] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const loadData = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // Check DB Status
      const status = await api.getStatus().catch(() => ({ connected: false, message: 'API unreachable' }));
      setDbConnected(status.connected);

      // Fetch all domain datasets in parallel
      const [
        fetchedPortfolios,
        fetchedProposals,
        fetchedSimulations,
        fetchedFactors,
        fetchedSectors,
        fetchedAudit
      ] = await Promise.all([
        api.getPortfolios().catch(() => INITIAL_PORTFOLIOS),
        api.getProposals().catch(() => INITIAL_PROPOSALS),
        api.getSimulations().catch(() => INITIAL_SIMULATIONS),
        api.getFactors().catch(() => INITIAL_FACTOR_EXPOSURES),
        api.getSectors().catch(() => INITIAL_SECTORS),
        api.getAuditLogs().catch(() => INITIAL_AUDIT_LOGS)
      ]);

      if (fetchedPortfolios.length > 0) setPortfolios(fetchedPortfolios);
      if (fetchedProposals.length > 0) setProposals(fetchedProposals);
      if (fetchedSimulations.length > 0) setSimulations(fetchedSimulations);
      if (Object.keys(fetchedFactors).length > 0) setFactorExposures(fetchedFactors);
      if (Object.keys(fetchedSectors).length > 0) setSectorExposures(fetchedSectors);
      if (fetchedAudit.length > 0) setAuditLogs(fetchedAudit);
    } catch (err: any) {
      console.error('Failed to load data from backend:', err);
      setApiError('Unable to connect to backend service. Using fallback data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial data from backend API whenever authenticated state changes
  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const clearApiError = () => setApiError(null);

  const setSelectedPortfolioId = (id: string) => {
    setSelectedPortfolioIdState(id);
    localStorage.setItem(STORAGE_KEY_PORTFOLIO_ID, id);
  };

  const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId) || portfolios[0];

  const approveProposal = async (id: string, notes?: string) => {
    const now = new Date().toISOString();
    const existing = proposals.find(p => p.id === id);
    const code = existing ? existing.code : id;
    const portCode = existing ? existing.portfolioCode : selectedPortfolio.code;
    const actorName = user ? `${user.name} (${user.role.replace('_', ' ')})` : 'Portfolio Manager (Human Token #PM-8921)';

    const newLog: AuditActivityItem = {
      id: `log-${Date.now()}`,
      timestamp: now,
      type: 'PROPOSAL_APPROVED',
      portfolioCode: portCode,
      summary: `Proposal ${code} approved by ${user?.name || 'Human Portfolio Manager'}`,
      details: notes || 'Verified segregation-of-duties mandate compliance. Ready for simulated order generation.',
      actor: actorName as any,
      relatedProposalId: id
    };

    try {
      // Persist to backend API (MongoDB via Express JWT)
      const updated = await api.updateProposal(id, 'approved', notes);
      await api.addAuditLog(newLog).catch(() => {});

      // Synchronize shared React state on success
      setProposals(prev => prev.map(p => (p.id === id ? updated : p)));
      setAuditLogs(prev => [newLog, ...prev]);
    } catch (err: any) {
      console.error('Failed to save approval to API:', err);
      setApiError(`Failed to save approval: ${err.message}`);
      throw err;
    }
  };

  const rejectProposal = async (id: string, notes?: string) => {
    const now = new Date().toISOString();
    const existing = proposals.find(p => p.id === id);
    const code = existing ? existing.code : id;
    const portCode = existing ? existing.portfolioCode : selectedPortfolio.code;
    const actorName = user ? `${user.name} (${user.role.replace('_', ' ')})` : 'Portfolio Manager (Human Token #PM-8921)';

    const newLog: AuditActivityItem = {
      id: `log-${Date.now()}`,
      timestamp: now,
      type: 'PROPOSAL_REJECTED',
      portfolioCode: portCode,
      summary: `Proposal ${code} rejected by ${user?.name || 'Human Portfolio Manager'}`,
      details: notes || 'Discretionary PM veto. Execution halted in prototype sandbox.',
      actor: actorName as any,
      relatedProposalId: id
    };

    try {
      // Persist to backend API (MongoDB via Express JWT)
      const updated = await api.updateProposal(id, 'rejected', notes);
      await api.addAuditLog(newLog).catch(() => {});

      // Synchronize shared React state on success
      setProposals(prev => prev.map(p => (p.id === id ? updated : p)));
      setAuditLogs(prev => [newLog, ...prev]);
    } catch (err: any) {
      console.error('Failed to save rejection to API:', err);
      setApiError(`Failed to save rejection: ${err.message}`);
      throw err;
    }
  };

  const simulateExecuteProposal = async (id: string) => {
    const now = new Date().toISOString();
    const existing = proposals.find(p => p.id === id);
    const code = existing ? existing.code : id;
    const portCode = existing ? existing.portfolioCode : selectedPortfolio.code;

    const decisionMetadata: StrategyProposal['decisionMetadata'] = {
      decidedAt: existing?.decisionMetadata?.decidedAt || now,
      decidedBy: existing?.decisionMetadata?.decidedBy || 'Portfolio Manager (Human)',
      decision: 'APPROVED',
      notes: (existing?.decisionMetadata?.notes ? existing.decisionMetadata.notes + ' | ' : '') + 'Simulated algorithmic order slicing routed (Almgren-Chriss model).'
    };

    const newLog: AuditActivityItem = {
      id: `log-${Date.now()}`,
      timestamp: now,
      type: 'SIMULATED_ORDER_ROUTED',
      portfolioCode: portCode,
      summary: `Simulated order sliced & routed for ${code}`,
      details: 'Dispatched to simulated Almgren-Chriss TWAP/VWAP execution queue. (Simulated prototype mode - no live brokerage touched).',
      actor: 'Execution Agent',
      relatedProposalId: id
    };

    try {
      // Persist to backend API (MongoDB via Express JWT)
      const updated = await api.updateProposal(id, 'simulated_executed', decisionMetadata.notes);
      await api.addAuditLog(newLog).catch(() => {});

      // Synchronize shared React state on success
      setProposals(prev => prev.map(p => (p.id === id ? updated : p)));
      setAuditLogs(prev => [newLog, ...prev]);
    } catch (err: any) {
      console.error('Failed to route simulated execution to API:', err);
      setApiError(`Failed to route order: ${err.message}`);
      throw err;
    }
  };

  const depositFunds = async (portfolioId: string, amount: number, paymentMethod: string) => {
    const now = new Date().toISOString();
    const target = portfolios.find(p => p.id === portfolioId) || selectedPortfolio;
    const actorName = user ? `${user.name} (${user.role.replace('_', ' ')})` : 'Portfolio Manager (Human Token #PM-8921)';

    const formattedAmount = `$${(amount / 1e6).toFixed(1)}M`;
    const newLog: AuditActivityItem = {
      id: `log-${Date.now()}`,
      timestamp: now,
      type: 'SIMULATED_ORDER_ROUTED',
      portfolioCode: target.code,
      summary: `Margin Deposit Processed - ${formattedAmount} (${paymentMethod})`,
      details: `Simulated payment gateway checkout verified. Settled to collateral cash sweep buffer. Actor: ${actorName}.`,
      actor: actorName as any
    };

    try {
      const updated = await api.depositFunds(portfolioId, amount);
      await api.addAuditLog(newLog).catch(() => {});

      // Update shared portfolios state
      setPortfolios(prev => prev.map(p => (p.id === portfolioId ? updated : p)));
      setAuditLogs(prev => [newLog, ...prev]);
    } catch (err: any) {
      console.error('Failed to process margin deposit via API:', err);
      setApiError(`Failed to process deposit: ${err.message}`);
      throw err;
    }
  };

  const resetToDefaults = async () => {
    try {
      await api.resetData().catch(() => {});
      setProposals(INITIAL_PROPOSALS);
      setAuditLogs(INITIAL_AUDIT_LOGS);
      setSelectedPortfolioIdState(INITIAL_PORTFOLIOS[0].id);
      localStorage.removeItem(STORAGE_KEY_PORTFOLIO_ID);
    } catch (err: any) {
      console.error('Reset failed:', err);
      setApiError(`Reset error: ${err.message}`);
    }
  };

  const getSimulationById = (simId: string) => {
    return simulations.find(s => s.id === simId);
  };

  const getProposalById = (propId: string) => {
    return proposals.find(p => p.id === propId);
  };

  return (
    <AlphaGenContext.Provider
      value={{
        portfolios,
        selectedPortfolioId,
        selectedPortfolio,
        setSelectedPortfolioId,
        proposals,
        simulations,
        auditLogs,
        factorExposures,
        sectorExposures,
        isLoading,
        dbConnected,
        apiError,
        clearApiError,
        reloadAllData: loadData,
        approveProposal,
        rejectProposal,
        simulateExecuteProposal,
        depositFunds,
        resetToDefaults,
        getSimulationById,
        getProposalById
      }}
    >
      {children}
    </AlphaGenContext.Provider>
  );
};

export const useAlphaGen = () => {
  const context = useContext(AlphaGenContext);
  if (!context) {
    throw new Error('useAlphaGen must be used within an AlphaGenProvider');
  }
  return context;
};
