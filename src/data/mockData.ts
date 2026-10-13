import { Portfolio, StrategyProposal, SimulationResult, FactorExposureItem, SectorExposureItem, AuditActivityItem } from '../types/alphagen';

export const INITIAL_PORTFOLIOS: Portfolio[] = [
  {
    id: 'port-quant-alpha-1',
    code: 'AG-ALPHA-EQ',
    name: 'AlphaGen US Large-Cap Equity Alpha',
    mandate: 'Long-biased quantitative factor equity targeting 400bps alpha over S&P 500 with strict factor neutrality bounds.',
    aum: 4850000000, // $4.85B
    cashBalance: 242500000, // 5% cash
    currency: 'USD',
    benchmark: 'S&P 500 TR (SPX)',
    totalPnL: 582000000,
    totalPnLPercent: 13.64,
    dailyPnL: 18450000,
    dailyPnLPercent: 0.38,
    ytdReturn: 16.42,
    targetVolatility: 12.0,
    currentRegime: 'trending',
    riskMetrics: {
      var95: -1.42,
      var99: -2.35,
      cvar95: -2.15,
      sharpeRatio: 2.18,
      sortinoRatio: 2.85,
      maxDrawdownHistorical: -8.4,
      maxDrawdownExpected: -5.2,
      volatilityAnnualized: 11.4,
      betaToSP500: 0.88,
      stressCrisis2008Drawdown: -16.8,
      stressCovid2020Drawdown: -12.4,
      stressRateHike2022Drawdown: -9.1,
      activeFactorRisk: 3.2,
    },
    holdings: [
      {
        id: 'h-1',
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        assetClass: 'Equity',
        sector: 'Information Technology',
        quantity: 360000,
        avgCost: 112.50,
        currentPrice: 134.80,
        marketValue: 485280000,
        weight: 10.01,
        unrealizedPnL: 80280000,
        unrealizedPnLPercent: 19.82,
        dailyReturn: 1.45,
      },
      {
        id: 'h-2',
        symbol: 'MSFT',
        name: 'Microsoft Corp',
        assetClass: 'Equity',
        sector: 'Information Technology',
        quantity: 1050000,
        avgCost: 405.20,
        currentPrice: 428.60,
        marketValue: 450030000,
        weight: 9.28,
        unrealizedPnL: 24570000,
        unrealizedPnLPercent: 5.77,
        dailyReturn: 0.62,
      },
      {
        id: 'h-3',
        symbol: 'AAPL',
        name: 'Apple Inc',
        assetClass: 'Equity',
        sector: 'Information Technology',
        quantity: 1750000,
        avgCost: 218.40,
        currentPrice: 231.10,
        marketValue: 404425000,
        weight: 8.34,
        unrealizedPnL: 22225000,
        unrealizedPnLPercent: 5.82,
        dailyReturn: -0.25,
      },
      {
        id: 'h-4',
        symbol: 'AMZN',
        name: 'Amazon.com Inc',
        assetClass: 'Equity',
        sector: 'Consumer Discretionary',
        quantity: 2100000,
        avgCost: 175.00,
        currentPrice: 188.50,
        marketValue: 395850000,
        weight: 8.16,
        unrealizedPnL: 28350000,
        unrealizedPnLPercent: 7.71,
        dailyReturn: 0.88,
      },
      {
        id: 'h-5',
        symbol: 'LLY',
        name: 'Eli Lilly and Company',
        assetClass: 'Equity',
        sector: 'Health Care',
        quantity: 380000,
        avgCost: 780.00,
        currentPrice: 895.40,
        marketValue: 340252000,
        weight: 7.02,
        unrealizedPnL: 43852000,
        unrealizedPnLPercent: 14.79,
        dailyReturn: 1.12,
      },
      {
        id: 'h-6',
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co',
        assetClass: 'Equity',
        sector: 'Financials',
        quantity: 1400000,
        avgCost: 198.50,
        currentPrice: 222.10,
        marketValue: 310940000,
        weight: 6.41,
        unrealizedPnL: 33040000,
        unrealizedPnLPercent: 11.89,
        dailyReturn: 0.35,
      },
      {
        id: 'h-7',
        symbol: 'AVGO',
        name: 'Broadcom Inc',
        assetClass: 'Equity',
        sector: 'Information Technology',
        quantity: 1800000,
        avgCost: 152.00,
        currentPrice: 172.40,
        marketValue: 310320000,
        weight: 6.40,
        unrealizedPnL: 36720000,
        unrealizedPnLPercent: 13.42,
        dailyReturn: 1.85,
      },
      {
        id: 'h-8',
        symbol: 'XOM',
        name: 'Exxon Mobil Corp',
        assetClass: 'Equity',
        sector: 'Energy',
        quantity: 2300000,
        avgCost: 116.00,
        currentPrice: 119.30,
        marketValue: 274390000,
        weight: 5.66,
        unrealizedPnL: 7590000,
        unrealizedPnLPercent: 2.84,
        dailyReturn: -0.75,
      },
      {
        id: 'h-9',
        symbol: 'GOOGL',
        name: 'Alphabet Inc Class A',
        assetClass: 'Equity',
        sector: 'Communication Services',
        quantity: 1550000,
        avgCost: 162.00,
        currentPrice: 168.90,
        marketValue: 261795000,
        weight: 5.40,
        unrealizedPnL: 10695000,
        unrealizedPnLPercent: 4.26,
        dailyReturn: -0.15,
      },
      {
        id: 'h-10',
        symbol: 'USD_CASH',
        name: 'Institutional Money Market Sweep',
        assetClass: 'Cash / FX',
        sector: 'Cash Equivalents',
        quantity: 242500000,
        avgCost: 1.00,
        currentPrice: 1.00,
        marketValue: 242500000,
        weight: 5.00,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0.00,
        dailyReturn: 0.01,
      }
    ],
    historicalPerformance: [
      { date: '2024-01-02', portfolioValue: 4165000000, benchmarkValue: 4165000000, drawdown: 0.0 },
      { date: '2024-02-15', portfolioValue: 4280000000, benchmarkValue: 4220000000, drawdown: -0.8 },
      { date: '2024-04-01', portfolioValue: 4410000000, benchmarkValue: 4330000000, drawdown: -1.2 },
      { date: '2024-05-15', portfolioValue: 4360000000, benchmarkValue: 4260000000, drawdown: -2.4 },
      { date: '2024-07-01', portfolioValue: 4590000000, benchmarkValue: 4470000000, drawdown: -0.6 },
      { date: '2024-08-15', portfolioValue: 4490000000, benchmarkValue: 4340000000, drawdown: -3.8 },
      { date: '2024-10-01', portfolioValue: 4720000000, benchmarkValue: 4530000000, drawdown: -1.1 },
      { date: '2024-11-15', portfolioValue: 4850000000, benchmarkValue: 4620000000, drawdown: 0.0 }
    ]
  },
  {
    id: 'port-quant-cross-2',
    code: 'AG-GLOBAL-MULTI',
    name: 'AlphaGen Cross-Asset Volatility & Carry',
    mandate: 'Multi-asset market-neutral systematic strategy generating uncorrelated return streams via volatility arbitrage and FX/Rates carry.',
    aum: 7200000000, // $7.2B
    cashBalance: 720000000, // 10% cash
    currency: 'USD',
    benchmark: 'SOFR + 450bps',
    totalPnL: 748800000,
    totalPnLPercent: 11.61,
    dailyPnL: 14200000,
    dailyPnLPercent: 0.20,
    ytdReturn: 12.85,
    targetVolatility: 7.5,
    currentRegime: 'volatility_driven',
    riskMetrics: {
      var95: -0.95,
      var99: -1.58,
      cvar95: -1.45,
      sharpeRatio: 2.45,
      sortinoRatio: 3.10,
      maxDrawdownHistorical: -4.8,
      maxDrawdownExpected: -3.6,
      volatilityAnnualized: 6.8,
      betaToSP500: 0.12,
      stressCrisis2008Drawdown: -7.5,
      stressCovid2020Drawdown: -5.8,
      stressRateHike2022Drawdown: -4.2,
      activeFactorRisk: 1.8,
    },
    holdings: [
      {
        id: 'hm-1',
        symbol: 'UST10Y_FUT',
        name: 'US 10Y Ultra Bond Futures',
        assetClass: 'Fixed Income',
        sector: 'Sovereign Debt',
        quantity: 12500,
        avgCost: 110.25,
        currentPrice: 112.40,
        marketValue: 1405000000,
        weight: 19.51,
        unrealizedPnL: 26875000,
        unrealizedPnLPercent: 1.95,
        dailyReturn: 0.18,
      },
      {
        id: 'hm-2',
        symbol: 'SPX_VOL_SWAP',
        name: 'S&P 500 3M Variance Swap Long',
        assetClass: 'Derivatives',
        sector: 'Equity Index Volatility',
        quantity: 85000,
        avgCost: 14.80,
        currentPrice: 16.40,
        marketValue: 1045000000,
        weight: 14.51,
        unrealizedPnL: 13600000,
        unrealizedPnLPercent: 1.32,
        dailyReturn: 1.25,
      },
      {
        id: 'hm-3',
        symbol: 'EURUSD_FWD',
        name: 'EUR/USD 6M Basis Swap (Short EUR)',
        assetClass: 'Cash / FX',
        sector: 'G10 Currencies',
        quantity: 800000000,
        avgCost: 1.092,
        currentPrice: 1.081,
        marketValue: 864800000,
        weight: 12.01,
        unrealizedPnL: 8800000,
        unrealizedPnLPercent: 1.03,
        dailyReturn: 0.15,
      },
      {
        id: 'hm-4',
        symbol: 'USD_CASH',
        name: 'Treasury Collateral & Overnight SOFR',
        assetClass: 'Cash / FX',
        sector: 'Cash Equivalents',
        quantity: 720000000,
        avgCost: 1.00,
        currentPrice: 1.00,
        marketValue: 720000000,
        weight: 10.00,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0.00,
        dailyReturn: 0.015,
      }
    ],
    historicalPerformance: [
      { date: '2024-01-02', portfolioValue: 6410000000, benchmarkValue: 6410000000, drawdown: 0.0 },
      { date: '2024-03-01', portfolioValue: 6580000000, benchmarkValue: 6500000000, drawdown: -0.4 },
      { date: '2024-05-01', portfolioValue: 6720000000, benchmarkValue: 6600000000, drawdown: -0.6 },
      { date: '2024-07-01', portfolioValue: 6890000000, benchmarkValue: 6710000000, drawdown: -0.3 },
      { date: '2024-09-01', portfolioValue: 7040000000, benchmarkValue: 6820000000, drawdown: -0.5 },
      { date: '2024-11-15', portfolioValue: 7200000000, benchmarkValue: 6930000000, drawdown: 0.0 }
    ]
  }
];

export const INITIAL_FACTOR_EXPOSURES: Record<string, FactorExposureItem[]> = {
  'port-quant-alpha-1': [
    {
      factor: 'Market Beta',
      loading: 0.88,
      benchmarkLoading: 1.00,
      activeExposure: -0.12,
      tStat: 8.45,
      standardDeviations60d: 0.42,
      driftAlert: false,
      description: 'Systematic equity market exposure calibrated with 60-day rolling Newey-West regression.'
    },
    {
      factor: 'Momentum',
      loading: 1.68,
      benchmarkLoading: 0.08,
      activeExposure: 1.60,
      tStat: 5.12,
      standardDeviations60d: 2.14,
      driftAlert: true,
      description: 'Price & earnings momentum loadings elevated following semiconductor & cloud infrastructure rally. Drift alert active (>2.0 SD).'
    },
    {
      factor: 'Quality',
      loading: 1.25,
      benchmarkLoading: 0.15,
      activeExposure: 1.10,
      tStat: 4.80,
      standardDeviations60d: 1.20,
      driftAlert: false,
      description: 'High return-on-equity and strong balance sheet characteristics over-indexed to buffer drawdown.'
    },
    {
      factor: 'Growth',
      loading: 1.40,
      benchmarkLoading: 0.20,
      activeExposure: 1.20,
      tStat: 4.10,
      standardDeviations60d: 1.45,
      driftAlert: false,
      description: 'Trailing 3-year revenue growth and forward EPS revision tilt.'
    } as any,
    {
      factor: 'Value',
      loading: -0.74,
      benchmarkLoading: 0.05,
      activeExposure: -0.79,
      tStat: -3.25,
      standardDeviations60d: -1.65,
      driftAlert: false,
      description: 'Negative tilt to traditional book-to-market due to overweight high-multiple AI hardware names.'
    },
    {
      factor: 'Size',
      loading: -0.85,
      benchmarkLoading: -0.10,
      activeExposure: -0.75,
      tStat: -4.10,
      standardDeviations60d: -1.30,
      driftAlert: false,
      description: 'Mega-cap concentration tilt reflecting institutional liquidity constraints.'
    },
    {
      factor: 'Volatility',
      loading: 0.35,
      benchmarkLoading: 0.00,
      activeExposure: 0.35,
      tStat: 1.82,
      standardDeviations60d: 0.85,
      driftAlert: false,
      description: 'Realized 30d idiosyncratic volatility loading across active equity positions.'
    }
  ],
  'port-quant-cross-2': [
    {
      factor: 'Market Beta',
      loading: 0.12,
      benchmarkLoading: 0.00,
      activeExposure: 0.12,
      tStat: 1.40,
      standardDeviations60d: 0.20,
      driftAlert: false,
      description: 'Market-neutral beta profile across multi-asset cross-hedges.'
    },
    {
      factor: 'Volatility',
      loading: -1.35,
      benchmarkLoading: 0.00,
      activeExposure: -1.35,
      tStat: -4.85,
      standardDeviations60d: -1.90,
      driftAlert: false,
      description: 'Short implied-vs-realized variance spread posture harvest.'
    },
    {
      factor: 'Yield / Carry',
      loading: 2.15,
      benchmarkLoading: 0.50,
      activeExposure: 1.65,
      tStat: 6.20,
      standardDeviations60d: 2.05,
      driftAlert: true,
      description: 'G10 interest rate differential carry loading with currency hedge. Drift alert active.'
    },
    {
      factor: 'Momentum',
      loading: 0.45,
      benchmarkLoading: 0.00,
      activeExposure: 0.45,
      tStat: 2.10,
      standardDeviations60d: 0.65,
      driftAlert: false,
      description: 'Cross-asset trend-following component in sovereign bond curves.'
    }
  ]
};

export const INITIAL_SECTORS: Record<string, SectorExposureItem[]> = {
  'port-quant-alpha-1': [
    { sector: 'Information Technology', weight: 34.03, benchmarkWeight: 29.50, activeWeight: 4.53, contributionToRisk: 48.2 },
    { sector: 'Consumer Discretionary', weight: 12.40, benchmarkWeight: 10.20, activeWeight: 2.20, contributionToRisk: 14.5 },
    { sector: 'Health Care', weight: 11.20, benchmarkWeight: 12.10, activeWeight: -0.90, contributionToRisk: 9.8 },
    { sector: 'Financials', weight: 13.50, benchmarkWeight: 13.20, activeWeight: 0.30, contributionToRisk: 11.0 },
    { sector: 'Communication Services', weight: 8.90, benchmarkWeight: 8.80, activeWeight: 0.10, contributionToRisk: 7.4 },
    { sector: 'Energy', weight: 5.66, benchmarkWeight: 4.10, activeWeight: 1.56, contributionToRisk: 5.2 },
    { sector: 'Industrials', weight: 5.10, benchmarkWeight: 8.40, activeWeight: -3.30, contributionToRisk: 2.6 },
    { sector: 'Cash Equivalents', weight: 5.00, benchmarkWeight: 0.00, activeWeight: 5.00, contributionToRisk: 0.0 },
  ],
  'port-quant-cross-2': [
    { sector: 'Sovereign Debt (Rates)', weight: 38.50, benchmarkWeight: 30.00, activeWeight: 8.50, contributionToRisk: 34.2 },
    { sector: 'Equity Index Volatility', weight: 26.20, benchmarkWeight: 20.00, activeWeight: 6.20, contributionToRisk: 42.1 },
    { sector: 'G10 Currencies (FX)', weight: 25.30, benchmarkWeight: 20.00, activeWeight: 5.30, contributionToRisk: 23.7 },
    { sector: 'Cash Collateral', weight: 10.00, benchmarkWeight: 10.00, activeWeight: 0.00, contributionToRisk: 0.0 },
  ]
};

export const INITIAL_SIMULATIONS: SimulationResult[] = [
  {
    id: 'sim-mc-9901',
    runTimestamp: '2024-11-15T09:42:18Z',
    strategyId: 'prop-mom-401',
    strategyName: 'Semiconductor Momentum Continuation & Rebalancing',
    portfolioId: 'port-quant-alpha-1',
    status: 'VALIDATED',
    pathsCount: 10000,
    instrumentsCount: 400,
    computeDurationMs: 116,
    assumptions: {
      volatilityModel: 'Heston Stochastic Volatility (Numba JIT)',
      jumpDiffusion: true,
      covarianceEstimation: 'PCA Shrinkage Estimator (60d window, Newey-West)',
      timeHorizonDays: 30,
      confidenceInterval: 99,
      almgrenChrissHorizonMin: 30,
    },
    metrics: {
      expectedReturn30d: 3.42,
      var95: -1.35,
      var99: -2.18,
      cvar95: -2.52,
      sharpeDistribution: { min: 1.75, median: 2.38, max: 2.95 },
      maxDrawdownProb95: -4.6,
      hitRateProbability: 71.2,
      estimatedSlippageBps: 3.8,
    },
    distributionPaths: [
      { timeStep: 0, p5: 0.0, p25: 0.0, median: 0.0, p75: 0.0, p95: 0.0 },
      { timeStep: 5, p5: -0.9, p25: -0.1, median: 0.6, p75: 1.3, p95: 2.2 },
      { timeStep: 10, p5: -1.3, p25: 0.3, median: 1.2, p75: 2.1, p95: 3.5 },
      { timeStep: 15, p5: -1.6, p25: 0.8, median: 1.9, p75: 3.0, p95: 4.8 },
      { timeStep: 20, p5: -1.8, p25: 1.2, median: 2.5, p75: 3.8, p95: 5.9 },
      { timeStep: 25, p5: -2.0, p25: 1.6, median: 3.0, p75: 4.5, p95: 6.8 },
      { timeStep: 30, p5: -2.18, p25: 1.9, median: 3.42, p75: 5.1, p95: 7.6 },
    ],
    riskCheckOutcome: {
      passed: true,
      varCheckPassed: true,
      concentrationLimitPassed: true,
      liquidityFloorPassed: true,
      vetoTriggered: false,
    }
  },
  {
    id: 'sim-mc-9902',
    runTimestamp: '2024-11-15T10:14:05Z',
    strategyId: 'prop-vol-402',
    strategyName: 'VIX Term Structure Mean-Reverting Spread',
    portfolioId: 'port-quant-cross-2',
    status: 'VALIDATED',
    pathsCount: 10000,
    instrumentsCount: 400,
    computeDurationMs: 112,
    assumptions: {
      volatilityModel: 'Heston Stochastic Volatility (Numba JIT)',
      jumpDiffusion: true,
      covarianceEstimation: 'PCA Shrinkage Estimator (60d window, Newey-West)',
      timeHorizonDays: 30,
      confidenceInterval: 99,
      almgrenChrissHorizonMin: 45,
    },
    metrics: {
      expectedReturn30d: 2.15,
      var95: -0.88,
      var99: -1.45,
      cvar95: -1.62,
      sharpeDistribution: { min: 2.05, median: 2.62, max: 3.20 },
      maxDrawdownProb95: -3.2,
      hitRateProbability: 76.5,
      estimatedSlippageBps: 4.5,
    },
    distributionPaths: [
      { timeStep: 0, p5: 0.0, p25: 0.0, median: 0.0, p75: 0.0, p95: 0.0 },
      { timeStep: 5, p5: -0.5, p25: 0.1, median: 0.4, p75: 0.8, p95: 1.4 },
      { timeStep: 10, p5: -0.8, p25: 0.3, median: 0.8, p75: 1.4, p95: 2.1 },
      { timeStep: 15, p5: -1.1, p25: 0.6, median: 1.2, p75: 1.9, p95: 2.9 },
      { timeStep: 20, p5: -1.2, p25: 0.9, median: 1.6, p75: 2.3, p95: 3.5 },
      { timeStep: 25, p5: -1.35, p25: 1.1, median: 1.9, p75: 2.7, p95: 4.1 },
      { timeStep: 30, p5: -1.45, p25: 1.3, median: 2.15, p75: 3.1, p95: 4.8 },
    ],
    riskCheckOutcome: {
      passed: true,
      varCheckPassed: true,
      concentrationLimitPassed: true,
      liquidityFloorPassed: true,
      vetoTriggered: false,
    }
  },
  {
    id: 'sim-mc-9903',
    runTimestamp: '2024-11-15T10:48:30Z',
    strategyId: 'prop-mr-403',
    strategyName: 'Energy Factor Disconnect & Mean Reversion Arbitrage',
    portfolioId: 'port-quant-alpha-1',
    status: 'VALIDATED',
    pathsCount: 10000,
    instrumentsCount: 400,
    computeDurationMs: 119,
    assumptions: {
      volatilityModel: 'Heston Stochastic Volatility (Numba JIT)',
      jumpDiffusion: true,
      covarianceEstimation: 'PCA Shrinkage Estimator (60d window, Newey-West)',
      timeHorizonDays: 30,
      confidenceInterval: 99,
      almgrenChrissHorizonMin: 30,
    },
    metrics: {
      expectedReturn30d: 1.95,
      var95: -1.10,
      var99: -1.85,
      cvar95: -2.05,
      sharpeDistribution: { min: 1.50, median: 2.10, max: 2.70 },
      maxDrawdownProb95: -3.9,
      hitRateProbability: 64.8,
      estimatedSlippageBps: 2.9,
    },
    distributionPaths: [
      { timeStep: 0, p5: 0.0, p25: 0.0, median: 0.0, p75: 0.0, p95: 0.0 },
      { timeStep: 5, p5: -0.7, p25: -0.1, median: 0.3, p75: 0.7, p95: 1.5 },
      { timeStep: 10, p5: -1.0, p25: 0.2, median: 0.7, p75: 1.3, p95: 2.3 },
      { timeStep: 15, p5: -1.3, p25: 0.5, median: 1.1, p75: 1.8, p95: 3.1 },
      { timeStep: 20, p5: -1.5, p25: 0.8, median: 1.4, p75: 2.2, p95: 3.8 },
      { timeStep: 25, p5: -1.7, p25: 1.0, median: 1.7, p75: 2.6, p95: 4.4 },
      { timeStep: 30, p5: -1.85, p25: 1.2, median: 1.95, p75: 3.0, p95: 5.1 },
    ],
    riskCheckOutcome: {
      passed: true,
      varCheckPassed: true,
      concentrationLimitPassed: true,
      liquidityFloorPassed: true,
      vetoTriggered: false,
    }
  },
  {
    id: 'sim-mc-9904',
    runTimestamp: '2024-11-14T15:20:10Z',
    strategyId: 'prop-carry-404',
    strategyName: 'Aggressive Emerging FX Carry Rotation',
    portfolioId: 'port-quant-cross-2',
    status: 'FAILED_RISK_CHECK',
    pathsCount: 10000,
    instrumentsCount: 400,
    computeDurationMs: 122,
    assumptions: {
      volatilityModel: 'Heston Stochastic Volatility (Numba JIT)',
      jumpDiffusion: true,
      covarianceEstimation: 'PCA Shrinkage Estimator (60d window, Newey-West)',
      timeHorizonDays: 30,
      confidenceInterval: 99,
      almgrenChrissHorizonMin: 30,
    },
    metrics: {
      expectedReturn30d: 4.80,
      var95: -2.85,
      var99: -4.92,
      cvar95: -5.40,
      sharpeDistribution: { min: 0.85, median: 1.45, max: 2.10 },
      maxDrawdownProb95: -9.8,
      hitRateProbability: 54.0,
      estimatedSlippageBps: 18.5,
    },
    distributionPaths: [
      { timeStep: 0, p5: 0.0, p25: 0.0, median: 0.0, p75: 0.0, p95: 0.0 },
      { timeStep: 5, p5: -2.2, p25: -0.4, median: 0.8, p75: 1.9, p95: 3.5 },
      { timeStep: 10, p5: -3.1, p25: 0.0, median: 1.5, p75: 2.8, p95: 5.2 },
      { timeStep: 15, p5: -3.9, p25: 0.3, median: 2.3, p75: 3.9, p95: 7.1 },
      { timeStep: 20, p5: -4.4, p25: 0.6, median: 3.1, p75: 5.0, p95: 8.8 },
      { timeStep: 25, p5: -4.7, p25: 0.8, median: 3.9, p75: 6.2, p95: 10.4 },
      { timeStep: 30, p5: -4.92, p25: 1.1, median: 4.80, p75: 7.4, p95: 12.1 },
    ],
    riskCheckOutcome: {
      passed: false,
      varCheckPassed: false,
      concentrationLimitPassed: true,
      liquidityFloorPassed: false,
      vetoTriggered: true,
      vetoReason: 'Portfolio 99% VaR exceeds mandate limit (-2.50%). Projected trade size exceeds 5% ADV illiquidity threshold in target currency forward.',
    }
  }
];

export const INITIAL_PROPOSALS: StrategyProposal[] = [
  {
    id: 'prop-mom-401',
    code: 'PROP-2024-MOM-401',
    title: 'Semiconductor Momentum Continuation & Rebalancing',
    category: 'momentum',
    portfolioId: 'port-quant-alpha-1',
    portfolioCode: 'AG-ALPHA-EQ',
    createdAt: '2024-11-15T09:45:00Z',
    status: 'pending',
    urgency: 'HIGH',
    confidenceScore: 89,
    triggerEvent: 'NVDA & AVGO factor loadings exceeded +2.1 SD 60-day momentum threshold; earnings revision upgrade cycle detected via Refinitiv streaming feed.',
    thesis: 'Sustain upside participation in mega-cap semiconductor AI infrastructure rally while locking in 80bps gains and re-allocating across high Sharpe names to remain inside sector concentration limits.',
    rationale: [
      'Momentum factor loading stands at +1.68 with high statistical significance (t-stat 5.12).',
      'Refinitiv consensus forward earnings revisions adjusted +4.2% higher over the last 48 hours.',
      'Almgren-Chriss market impact model projects 3.8 bps execution drag over a 30-minute slicing horizon.',
      'Monte Carlo 10,000-path simulation indicates a 71.2% probability of achieving target 30-day alpha.'
    ],
    supportingFactorSignals: [
      { factor: 'Momentum Loading', observedValue: '+1.68 z-score', signalStrength: 'Strong Positive', zScore: 2.14 },
      { factor: 'Quality / ROE', observedValue: '38.4% Net Margin', signalStrength: 'Strong Positive', zScore: 1.85 },
      { factor: 'Earnings Revisions', observedValue: '+4.2% 7-day diff', signalStrength: 'Positive', zScore: 1.62 },
      { factor: 'Realized Volatility', observedValue: '32.5% annualized', signalStrength: 'Neutral', zScore: 0.45 }
    ],
    expectedImpact: {
      expectedReturn: 3.42,
      expectedSharpeDelta: 0.20,
      portfolioVarDelta: -0.07,
      turnover: 1.85,
      estimatedTransactionCostsBps: 3.8
    },
    trades: [
      {
        symbol: 'NVDA',
        action: 'BUY',
        shares: 45000,
        estimatedPrice: 134.80,
        notionalValue: 6066000,
        targetWeightDelta: 0.12,
        advPercentage: 0.85,
        executionStyle: 'Almgren-Chriss Optimal Slicing'
      },
      {
        symbol: 'AVGO',
        action: 'BUY',
        shares: 35000,
        estimatedPrice: 172.40,
        notionalValue: 6034000,
        targetWeightDelta: 0.12,
        advPercentage: 1.15,
        executionStyle: 'Almgren-Chriss Optimal Slicing'
      },
      {
        symbol: 'XOM',
        action: 'SELL',
        shares: 100000,
        estimatedPrice: 119.30,
        notionalValue: 11930000,
        targetWeightDelta: -0.24,
        advPercentage: 0.62,
        executionStyle: 'TWAP 30m'
      }
    ],
    riskChecks: [
      { name: 'VaR 99% Constraint Check', passed: true, details: 'Post-trade VaR 99% is -2.28% (under -2.50% mandate ceiling).', severity: 'pass' },
      { name: 'Sector Exposure Ceiling (Tech < 35%)', passed: true, details: 'Tech sector weight adjusts from 34.03% to 34.27% (limit 35.0%).', severity: 'pass' },
      { name: 'Single-Stock Max Weight (< 12%)', passed: true, details: 'NVDA weight after reallocation is 10.13% (well within 12.0% cap).', severity: 'pass' },
      { name: 'Liquidity Floor (< 5% ADV)', passed: true, details: 'Max trade ADV participation is 1.15% on AVGO (safe threshold <5%).', severity: 'pass' }
    ],
    simulationId: 'sim-mc-9901'
  },
  {
    id: 'prop-vol-402',
    code: 'PROP-2024-VOL-402',
    title: 'VIX Term Structure Mean-Reverting Spread',
    category: 'volatility_arbitrage',
    portfolioId: 'port-quant-cross-2',
    portfolioCode: 'AG-GLOBAL-MULTI',
    createdAt: '2024-11-15T10:15:00Z',
    status: 'pending',
    urgency: 'MEDIUM',
    confidenceScore: 84,
    triggerEvent: '1M/3M VIX futures curve steepness inverted beyond 95th percentile historical threshold during morning macro announcement.',
    thesis: 'Exploit structural steepening in the 1M-to-3M volatility term structure by selling rich front-month variance swap while buying deferred contract.',
    rationale: [
      'Term structure curvature spread widened to 2.4 vol points, exceeding 60-day historical bounds.',
      'Hidden Markov Model regime classifier flags market state as volatility-driven regime with high mean-reversion probability.',
      'Net delta to underlying equity index remains within +/- 0.05 tolerance.',
      'Precomputed Numba simulation validates 76.5% win rate over 30 days.'
    ],
    supportingFactorSignals: [
      { factor: 'Term Structure Slope', observedValue: '2.4 vol pts', signalStrength: 'Strong Positive', zScore: 2.30 },
      { factor: 'Variance Risk Premium', observedValue: '3.1% IV vs RV', signalStrength: 'Positive', zScore: 1.75 },
      { factor: 'Cross-Asset Vol Correlation', observedValue: '0.42 (low)', signalStrength: 'Positive', zScore: 1.10 }
    ],
    expectedImpact: {
      expectedReturn: 2.15,
      expectedSharpeDelta: 0.17,
      portfolioVarDelta: -0.05,
      turnover: 0.95,
      estimatedTransactionCostsBps: 4.5
    },
    trades: [
      {
        symbol: 'SPX_VOL_SWAP_1M',
        action: 'SELL',
        shares: 25000,
        estimatedPrice: 17.80,
        notionalValue: 445000000,
        targetWeightDelta: -6.18,
        advPercentage: 2.40,
        executionStyle: 'VWAP 45m'
      },
      {
        symbol: 'SPX_VOL_SWAP_3M',
        action: 'BUY',
        shares: 26000,
        estimatedPrice: 15.40,
        notionalValue: 400400000,
        targetWeightDelta: 5.56,
        advPercentage: 1.95,
        executionStyle: 'VWAP 45m'
      }
    ],
    riskChecks: [
      { name: 'VaR 99% Constraint Check', passed: true, details: 'Cross-asset VaR 99% remains at -1.53% (limit -2.00%).', severity: 'pass' },
      { name: 'Vega Sensitivity Cap ($2.5M/vol point)', passed: true, details: 'Net portfolio vega after hedge is +$1.15M/point.', severity: 'pass' },
      { name: 'Liquidity Floor (< 5% ADV)', passed: true, details: 'Front month tranche represents 2.40% ADV (limit < 5%).', severity: 'pass' }
    ],
    simulationId: 'sim-mc-9902'
  },
  {
    id: 'prop-mr-403',
    code: 'PROP-2024-MR-403',
    title: 'Energy Factor Disconnect & Mean Reversion Arbitrage',
    category: 'mean_reversion',
    portfolioId: 'port-quant-alpha-1',
    portfolioCode: 'AG-ALPHA-EQ',
    createdAt: '2024-11-15T10:50:00Z',
    status: 'pending',
    urgency: 'LOW',
    confidenceScore: 78,
    triggerEvent: 'Energy sector factor loading deviated -1.65 SD from 60-day mean following localized commodity inventory release.',
    thesis: 'Rebalance temporary dislocation between integrated oil valuations and crude prompt futures curve through sector pairs re-weighting.',
    rationale: [
      'Rolling regression indicates oil major discount to underlying asset NAV is 2.8 standard deviations.',
      'Mean-reversion half-life estimated at 8.4 trading days.',
      'Almgren-Chriss estimated execution slippage is minimal (2.9 bps).'
    ],
    supportingFactorSignals: [
      { factor: 'Value Factor Spread', observedValue: '-1.65 SD', signalStrength: 'Positive', zScore: -1.65 },
      { factor: 'Commodity Basis', observedValue: '+1.4% Backwardation', signalStrength: 'Neutral', zScore: 0.85 }
    ],
    expectedImpact: {
      expectedReturn: 1.95,
      expectedSharpeDelta: 0.12,
      portfolioVarDelta: 0.02,
      turnover: 0.65,
      estimatedTransactionCostsBps: 2.9
    },
    trades: [
      {
        symbol: 'XOM',
        action: 'BUY',
        shares: 35000,
        estimatedPrice: 119.30,
        notionalValue: 4175500,
        targetWeightDelta: 0.08,
        advPercentage: 0.40,
        executionStyle: 'TWAP 30m'
      }
    ],
    riskChecks: [
      { name: 'VaR 99% Constraint Check', passed: true, details: 'Portfolio VaR 99% impact is +0.02% (well within tolerance).', severity: 'pass' },
      { name: 'Sector Exposure Ceiling', passed: true, details: 'Energy sector remains at 5.74% (cap is 10.0%).', severity: 'pass' }
    ],
    simulationId: 'sim-mc-9903'
  },
  {
    id: 'prop-carry-404',
    code: 'PROP-2024-CARRY-404',
    title: 'Aggressive Emerging FX Carry Rotation',
    category: 'carry',
    portfolioId: 'port-quant-cross-2',
    portfolioCode: 'AG-GLOBAL-MULTI',
    createdAt: '2024-11-14T15:25:00Z',
    status: 'rejected',
    urgency: 'HIGH',
    confidenceScore: 52,
    triggerEvent: 'High yield spread opportunity triggered in Latin American currency swap forward markets.',
    thesis: 'Capture 480bps annualized carry yield by funding short JPY and long high-beta currency swap contracts.',
    rationale: [
      'Autonomous Carry Agent proposed high notional deployment to capture interest rate differential.',
      'However, Risk Assessment Agent simulation detected extreme tail risk in currency gap events.'
    ],
    supportingFactorSignals: [
      { factor: 'Carry Yield Spread', observedValue: '480 bps', signalStrength: 'Strong Positive', zScore: 2.80 },
      { factor: 'Tail Jump Volatility', observedValue: 'High Jump Risk', signalStrength: 'Negative', zScore: -2.40 }
    ],
    expectedImpact: {
      expectedReturn: 4.80,
      expectedSharpeDelta: -0.15,
      portfolioVarDelta: 0.72,
      turnover: 4.20,
      estimatedTransactionCostsBps: 18.5
    },
    trades: [
      {
        symbol: 'BRL_USD_NDF',
        action: 'BUY',
        shares: 150000000,
        estimatedPrice: 5.72,
        notionalValue: 858000000,
        targetWeightDelta: 11.91,
        advPercentage: 8.40,
        executionStyle: 'TWAP 30m'
      }
    ],
    riskChecks: [
      { name: 'VaR 99% Constraint Check', passed: false, details: 'Projected VaR 99% jumped to -4.92%, violating mandate limit of -2.50%.', severity: 'fail' },
      { name: 'Liquidity Floor (< 5% ADV)', passed: false, details: 'Trade size is 8.40% ADV, exceeding the 5% illiquidity floor.', severity: 'fail' }
    ],
    simulationId: 'sim-mc-9904',
    decisionMetadata: {
      decidedAt: '2024-11-14T15:30:12Z',
      decidedBy: 'Risk Assessment Agent (Automatic Veto) & PM Review',
      decision: 'REJECTED',
      notes: 'Mandate risk limits violated. Trade illiquidity (8.40% ADV) and tail jump probability rejected under crisis stress-test scenarios.'
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditActivityItem[] = [
  {
    id: 'log-101',
    timestamp: '2024-11-15T10:50:00Z',
    type: 'PROPOSAL_GENERATED',
    portfolioCode: 'AG-ALPHA-EQ',
    summary: 'Mean-reversion strategy proposal generated (PROP-2024-MR-403)',
    details: 'Triggered by 1.65 SD energy factor disconnect from 60-day rolling baseline.',
    actor: 'Autonomous Agent',
    relatedProposalId: 'prop-mr-403',
    relatedSimulationId: 'sim-mc-9903'
  },
  {
    id: 'log-102',
    timestamp: '2024-11-15T10:48:30Z',
    type: 'SIMULATION_COMPLETED',
    portfolioCode: 'AG-ALPHA-EQ',
    summary: 'Numba Monte Carlo simulation finished in 119ms (sim-mc-9903)',
    details: '10,000 paths evaluated across 400 instruments. Risk check outcome: PASSED.',
    actor: 'Risk Engine (Numba)',
    relatedSimulationId: 'sim-mc-9903'
  },
  {
    id: 'log-103',
    timestamp: '2024-11-15T10:15:00Z',
    type: 'PROPOSAL_GENERATED',
    portfolioCode: 'AG-GLOBAL-MULTI',
    summary: 'Volatility arbitrage proposal generated (PROP-2024-VOL-402)',
    details: 'Triggered by 95th percentile VIX term structure steepness anomaly.',
    actor: 'Autonomous Agent',
    relatedProposalId: 'prop-vol-402',
    relatedSimulationId: 'sim-mc-9902'
  },
  {
    id: 'log-104',
    timestamp: '2024-11-15T09:45:00Z',
    type: 'PROPOSAL_GENERATED',
    portfolioCode: 'AG-ALPHA-EQ',
    summary: 'Momentum rebalancing proposal generated (PROP-2024-MOM-401)',
    details: 'Semiconductor momentum loadings exceeded +2.1 SD. Expected alpha +3.42%.',
    actor: 'Autonomous Agent',
    relatedProposalId: 'prop-mom-401',
    relatedSimulationId: 'sim-mc-9901'
  },
  {
    id: 'log-105',
    timestamp: '2024-11-14T15:30:12Z',
    type: 'PROPOSAL_REJECTED',
    portfolioCode: 'AG-GLOBAL-MULTI',
    summary: 'Proposal PROP-2024-CARRY-404 automatically vetoed & rejected',
    details: 'Violated VaR 99% cap (-4.92% vs -2.50%) and ADV liquidity floor (8.40% ADV).',
    actor: 'Portfolio Manager (Human)',
    relatedProposalId: 'prop-carry-404',
    relatedSimulationId: 'sim-mc-9904'
  }
];
