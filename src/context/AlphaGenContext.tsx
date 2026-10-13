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
  
  // Actions
  approveProposal: (id: string, notes?: string) => void;
  rejectProposal: (id: string, notes?: string) => void;
  simulateExecuteProposal: (id: string) => void;
  resetToDefaults: () => void;
  
  // Quick lookup
  getSimulationById: (simId: string) => SimulationResult | undefined;
  getProposalById: (propId: string) => StrategyProposal | undefined;
}

const STORAGE_KEY_PROPOSALS = 'alphagen_proposals_v1';
const STORAGE_KEY_AUDIT = 'alphagen_audit_v1';
const STORAGE_KEY_PORTFOLIO_ID = 'alphagen_selected_portfolio_v1';

const AlphaGenContext = createContext<AlphaGenContextType | undefined>(undefined);

export const AlphaGenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolios] = useState<Portfolio[]>(INITIAL_PORTFOLIOS);
  
  const [selectedPortfolioId, setSelectedPortfolioIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PORTFOLIO_ID);
    return saved && INITIAL_PORTFOLIOS.some(p => p.id === saved) ? saved : INITIAL_PORTFOLIOS[0].id;
  });

  const [proposals, setProposals] = useState<StrategyProposal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROPOSALS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved proposals', e);
      }
    }
    return INITIAL_PROPOSALS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditActivityItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUDIT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved audit logs', e);
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [simulations] = useState<SimulationResult[]>(INITIAL_SIMULATIONS);
  const [factorExposures] = useState(INITIAL_FACTOR_EXPOSURES);
  const [sectorExposures] = useState(INITIAL_SECTORS);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROPOSALS, JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const setSelectedPortfolioId = (id: string) => {
    setSelectedPortfolioIdState(id);
    localStorage.setItem(STORAGE_KEY_PORTFOLIO_ID, id);
  };

  const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId) || portfolios[0];

  const approveProposal = (id: string, notes?: string) => {
    const now = new Date().toISOString();
    let updatedCode = '';
    let updatedPortCode = '';

    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        updatedCode = p.code;
        updatedPortCode = p.portfolioCode;
        return {
          ...p,
          status: 'approved',
          decisionMetadata: {
            decidedAt: now,
            decidedBy: 'Portfolio Manager (Human Token #PM-8921)',
            decision: 'APPROVED',
            notes: notes || 'Proposal approved by human portfolio manager following multi-factor & Monte Carlo risk verification.'
          }
        };
      }
      return p;
    }));

    const newLog: AuditActivityItem = {
      id: `log-${Date.now()}`,
      timestamp: now,
      type: 'PROPOSAL_APPROVED',
      portfolioCode: updatedPortCode || selectedPortfolio.code,
      summary: `Proposal ${updatedCode || id} approved by Human Portfolio Manager`,
      details: notes || 'Verified segregation-of-duties mandate compliance. Ready for simulated order generation.',
      actor: 'Portfolio Manager (Human)',
      relatedProposalId: id
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  const rejectProposal = (id: string, notes?: string) => {
    const now = new Date().toISOString();
    let updatedCode = '';
    let updatedPortCode = '';

    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        updatedCode = p.code;
        updatedPortCode = p.portfolioCode;
        return {
          ...p,
          status: 'rejected',
          decisionMetadata: {
            decidedAt: now,
            decidedBy: 'Portfolio Manager (Human Token #PM-8921)',
            decision: 'REJECTED',
            notes: notes || 'Proposal rejected by portfolio manager discretion.'
          }
        };
      }
      return p;
    }));

    const newLog: AuditActivityItem = {
      id: `log-${Date.now()}`,
      timestamp: now,
      type: 'PROPOSAL_REJECTED',
      portfolioCode: updatedPortCode || selectedPortfolio.code,
      summary: `Proposal ${updatedCode || id} rejected by Human Portfolio Manager`,
      details: notes || 'Discretionary PM veto. Execution halted in prototype sandbox.',
      actor: 'Portfolio Manager (Human)',
      relatedProposalId: id
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  const simulateExecuteProposal = (id: string) => {
    const now = new Date().toISOString();
    let updatedCode = '';
    let updatedPortCode = '';

    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        updatedCode = p.code;
        updatedPortCode = p.portfolioCode;
        return {
          ...p,
          status: 'simulated_executed',
          decisionMetadata: {
            ...p.decisionMetadata,
            decidedAt: p.decisionMetadata?.decidedAt || now,
            decidedBy: p.decisionMetadata?.decidedBy || 'Portfolio Manager (Human)',
            decision: 'APPROVED',
            notes: (p.decisionMetadata?.notes ? p.decisionMetadata.notes + ' | ' : '') + 'Simulated algorithmic order slicing routed (Almgren-Chriss model).'
          }
        };
      }
      return p;
    }));

    const newLog: AuditActivityItem = {
      id: `log-${Date.now()}`,
      timestamp: now,
      type: 'SIMULATED_ORDER_ROUTED',
      portfolioCode: updatedPortCode || selectedPortfolio.code,
      summary: `Simulated order sliced & routed for ${updatedCode || id}`,
      details: 'Dispatched to simulated Almgren-Chriss TWAP/VWAP execution queue. (Simulated prototype mode - no live brokerage touched).',
      actor: 'Execution Agent',
      relatedProposalId: id
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY_PROPOSALS);
    localStorage.removeItem(STORAGE_KEY_AUDIT);
    localStorage.removeItem(STORAGE_KEY_PORTFOLIO_ID);
    setProposals(INITIAL_PROPOSALS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSelectedPortfolioIdState(INITIAL_PORTFOLIOS[0].id);
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
        approveProposal,
        rejectProposal,
        simulateExecuteProposal,
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
