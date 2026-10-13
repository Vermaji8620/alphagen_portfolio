export type MarketRegime = 'trending' | 'mean_reverting' | 'volatility_driven' | 'liquidity_strained';

export type StrategyCategory = 'momentum' | 'mean_reversion' | 'volatility_arbitrage' | 'carry';

export type ProposalStatus = 'pending' | 'approved' | 'rejected' | 'simulated_executed';

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  assetClass: 'Equity' | 'Fixed Income' | 'Derivatives' | 'Cash / FX';
  sector: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  weight: number; // percentage (e.g. 12.5)
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  dailyReturn: number;
}

export interface PortfolioRiskMetrics {
  var95: number; // e.g. -1.42%
  var99: number; // e.g. -2.35%
  cvar95: number; // e.g. -2.15%
  sharpeRatio: number; // e.g. 2.18
  sortinoRatio: number; // e.g. 2.85
  maxDrawdownHistorical: number; // e.g. -8.4%
  maxDrawdownExpected: number; // e.g. -5.2%
  volatilityAnnualized: number; // e.g. 11.4%
  betaToSP500: number; // e.g. 0.88
  stressCrisis2008Drawdown: number; // e.g. -16.8%
  stressCovid2020Drawdown: number; // e.g. -12.4%
  stressRateHike2022Drawdown: number; // e.g. -9.1%
  activeFactorRisk: number; // e.g. 3.2%
}

export interface Portfolio {
  id: string;
  name: string;
  code: string;
  mandate: string;
  aum: number;
  cashBalance: number;
  currency: string;
  benchmark: string;
  totalPnL: number;
  totalPnLPercent: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  ytdReturn: number;
  targetVolatility: number;
  currentRegime: MarketRegime;
  holdings: Holding[];
  riskMetrics: PortfolioRiskMetrics;
  historicalPerformance: {
    date: string;
    portfolioValue: number;
    benchmarkValue: number;
    drawdown: number;
  }[];
}

export interface FactorExposureItem {
  factor: 'Market Beta' | 'Value' | 'Momentum' | 'Size' | 'Quality' | 'Volatility' | 'Yield / Carry';
  loading: number; // z-score or beta loading, e.g. +1.45
  benchmarkLoading: number; // e.g. 1.00
  activeExposure: number; // difference
  tStat: number; // statistical significance
  standardDeviations60d: number; // e.g. 1.8 SD from 60d mean
  driftAlert: boolean; // true if > 2 SD
  description: string;
}

export interface SectorExposureItem {
  sector: string;
  weight: number;
  benchmarkWeight: number;
  activeWeight: number;
  contributionToRisk: number; // % of total risk
}

export interface MonteCarloSimulationPath {
  timeStep: number; // e.g. day 0..30
  p5: number;
  p25: number;
  median: number;
  p75: number;
  p95: number;
}

export interface SimulationResult {
  id: string;
  runTimestamp: string;
  strategyId: string;
  strategyName: string;
  portfolioId: string;
  status: 'COMPLETED' | 'VALIDATED' | 'FAILED_RISK_CHECK';
  pathsCount: number; // e.g. 10000
  instrumentsCount: number; // e.g. 400
  computeDurationMs: number; // e.g. 118 ms (Numba JIT)
  assumptions: {
    volatilityModel: string; // "Heston Stochastic Volatility"
    jumpDiffusion: boolean; // true
    covarianceEstimation: string; // "PCA Shrinkage Estimator (60d window)"
    timeHorizonDays: number; // 30
    confidenceInterval: number; // 99%
    almgrenChrissHorizonMin: number; // 30 mins
  };
  metrics: {
    expectedReturn30d: number; // % e.g. +3.85%
    var95: number; // e.g. -1.24%
    var99: number; // e.g. -2.10%
    cvar95: number; // e.g. -2.78%
    sharpeDistribution: {
      min: number;
      median: number;
      max: number;
    };
    maxDrawdownProb95: number; // e.g. -4.8%
    hitRateProbability: number; // e.g. 68.4%
    estimatedSlippageBps: number; // e.g. 4.2 bps
  };
  distributionPaths: MonteCarloSimulationPath[];
  riskCheckOutcome: {
    passed: boolean;
    varCheckPassed: boolean;
    concentrationLimitPassed: boolean;
    liquidityFloorPassed: boolean; // <5% ADV
    vetoTriggered: boolean;
    vetoReason?: string;
  };
}

export interface ProposedTradeLeg {
  symbol: string;
  action: 'BUY' | 'SELL';
  shares: number;
  estimatedPrice: number;
  notionalValue: number;
  targetWeightDelta: number; // % change, e.g. +1.8%
  advPercentage: number; // percentage of 30d Average Daily Volume
  executionStyle: 'TWAP 30m' | 'VWAP 45m' | 'Almgren-Chriss Optimal Slicing';
}

export interface StrategyProposal {
  id: string;
  code: string;
  title: string;
  category: StrategyCategory;
  portfolioId: string;
  portfolioCode: string;
  createdAt: string;
  status: ProposalStatus;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number; // 0 - 100%
  triggerEvent: string;
  thesis: string;
  rationale: string[];
  supportingFactorSignals: {
    factor: string;
    observedValue: string;
    signalStrength: 'Strong Positive' | 'Positive' | 'Neutral' | 'Negative';
    zScore: number;
  }[];
  expectedImpact: {
    expectedReturn: number; // %
    expectedSharpeDelta: number; // e.g. +0.24
    portfolioVarDelta: number; // e.g. -0.08%
    turnover: number; // e.g. 2.4%
    estimatedTransactionCostsBps: number;
  };
  trades: ProposedTradeLeg[];
  riskChecks: {
    name: string;
    passed: boolean;
    details: string;
    severity: 'pass' | 'warning' | 'fail';
  }[];
  simulationId: string;
  decisionMetadata?: {
    decidedAt: string;
    decidedBy: string;
    decision: 'APPROVED' | 'REJECTED';
    notes?: string;
  };
}

export interface AuditActivityItem {
  id: string;
  timestamp: string;
  type: 'PROPOSAL_GENERATED' | 'SIMULATION_COMPLETED' | 'PROPOSAL_APPROVED' | 'PROPOSAL_REJECTED' | 'SIMULATED_ORDER_ROUTED' | 'RISK_VETO_ADJUSTED';
  portfolioCode: string;
  summary: string;
  details: string;
  actor: 'Autonomous Agent' | 'Risk Engine (Numba)' | 'Portfolio Manager (Human)' | 'Execution Agent';
  relatedProposalId?: string;
  relatedSimulationId?: string;
}
