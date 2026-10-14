// src/server/index.ts
import dns2 from "node:dns";
import express from "express";
import cors from "cors";
import dotenv2 from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// src/server/db.ts
import dns from "node:dns";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// src/data/mockData.ts
var INITIAL_PORTFOLIOS = [
  {
    id: "port-quant-alpha-1",
    code: "AG-ALPHA-EQ",
    name: "AlphaGen US Large-Cap Equity Alpha",
    mandate: "Long-biased quantitative factor equity targeting 400bps alpha over S&P 500 with strict factor neutrality bounds.",
    aum: 485e7,
    // $4.85B
    cashBalance: 2425e5,
    // 5% cash
    currency: "USD",
    benchmark: "S&P 500 TR (SPX)",
    totalPnL: 582e6,
    totalPnLPercent: 13.64,
    dailyPnL: 1845e4,
    dailyPnLPercent: 0.38,
    ytdReturn: 16.42,
    targetVolatility: 12,
    currentRegime: "trending",
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
      activeFactorRisk: 3.2
    },
    holdings: [
      {
        id: "h-1",
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        assetClass: "Equity",
        sector: "Information Technology",
        quantity: 36e4,
        avgCost: 112.5,
        currentPrice: 134.8,
        marketValue: 48528e4,
        weight: 10.01,
        unrealizedPnL: 8028e4,
        unrealizedPnLPercent: 19.82,
        dailyReturn: 1.45
      },
      {
        id: "h-2",
        symbol: "MSFT",
        name: "Microsoft Corp",
        assetClass: "Equity",
        sector: "Information Technology",
        quantity: 105e4,
        avgCost: 405.2,
        currentPrice: 428.6,
        marketValue: 45003e4,
        weight: 9.28,
        unrealizedPnL: 2457e4,
        unrealizedPnLPercent: 5.77,
        dailyReturn: 0.62
      },
      {
        id: "h-3",
        symbol: "AAPL",
        name: "Apple Inc",
        assetClass: "Equity",
        sector: "Information Technology",
        quantity: 175e4,
        avgCost: 218.4,
        currentPrice: 231.1,
        marketValue: 404425e3,
        weight: 8.34,
        unrealizedPnL: 22225e3,
        unrealizedPnLPercent: 5.82,
        dailyReturn: -0.25
      },
      {
        id: "h-4",
        symbol: "AMZN",
        name: "Amazon.com Inc",
        assetClass: "Equity",
        sector: "Consumer Discretionary",
        quantity: 21e5,
        avgCost: 175,
        currentPrice: 188.5,
        marketValue: 39585e4,
        weight: 8.16,
        unrealizedPnL: 2835e4,
        unrealizedPnLPercent: 7.71,
        dailyReturn: 0.88
      },
      {
        id: "h-5",
        symbol: "LLY",
        name: "Eli Lilly and Company",
        assetClass: "Equity",
        sector: "Health Care",
        quantity: 38e4,
        avgCost: 780,
        currentPrice: 895.4,
        marketValue: 340252e3,
        weight: 7.02,
        unrealizedPnL: 43852e3,
        unrealizedPnLPercent: 14.79,
        dailyReturn: 1.12
      },
      {
        id: "h-6",
        symbol: "JPM",
        name: "JPMorgan Chase & Co",
        assetClass: "Equity",
        sector: "Financials",
        quantity: 14e5,
        avgCost: 198.5,
        currentPrice: 222.1,
        marketValue: 31094e4,
        weight: 6.41,
        unrealizedPnL: 3304e4,
        unrealizedPnLPercent: 11.89,
        dailyReturn: 0.35
      },
      {
        id: "h-7",
        symbol: "AVGO",
        name: "Broadcom Inc",
        assetClass: "Equity",
        sector: "Information Technology",
        quantity: 18e5,
        avgCost: 152,
        currentPrice: 172.4,
        marketValue: 31032e4,
        weight: 6.4,
        unrealizedPnL: 3672e4,
        unrealizedPnLPercent: 13.42,
        dailyReturn: 1.85
      },
      {
        id: "h-8",
        symbol: "XOM",
        name: "Exxon Mobil Corp",
        assetClass: "Equity",
        sector: "Energy",
        quantity: 23e5,
        avgCost: 116,
        currentPrice: 119.3,
        marketValue: 27439e4,
        weight: 5.66,
        unrealizedPnL: 759e4,
        unrealizedPnLPercent: 2.84,
        dailyReturn: -0.75
      },
      {
        id: "h-9",
        symbol: "GOOGL",
        name: "Alphabet Inc Class A",
        assetClass: "Equity",
        sector: "Communication Services",
        quantity: 155e4,
        avgCost: 162,
        currentPrice: 168.9,
        marketValue: 261795e3,
        weight: 5.4,
        unrealizedPnL: 10695e3,
        unrealizedPnLPercent: 4.26,
        dailyReturn: -0.15
      },
      {
        id: "h-10",
        symbol: "USD_CASH",
        name: "Institutional Money Market Sweep",
        assetClass: "Cash / FX",
        sector: "Cash Equivalents",
        quantity: 2425e5,
        avgCost: 1,
        currentPrice: 1,
        marketValue: 2425e5,
        weight: 5,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0,
        dailyReturn: 0.01
      }
    ],
    historicalPerformance: [
      { date: "2024-01-02", portfolioValue: 4165e6, benchmarkValue: 4165e6, drawdown: 0 },
      { date: "2024-02-15", portfolioValue: 428e7, benchmarkValue: 422e7, drawdown: -0.8 },
      { date: "2024-04-01", portfolioValue: 441e7, benchmarkValue: 433e7, drawdown: -1.2 },
      { date: "2024-05-15", portfolioValue: 436e7, benchmarkValue: 426e7, drawdown: -2.4 },
      { date: "2024-07-01", portfolioValue: 459e7, benchmarkValue: 447e7, drawdown: -0.6 },
      { date: "2024-08-15", portfolioValue: 449e7, benchmarkValue: 434e7, drawdown: -3.8 },
      { date: "2024-10-01", portfolioValue: 472e7, benchmarkValue: 453e7, drawdown: -1.1 },
      { date: "2024-11-15", portfolioValue: 485e7, benchmarkValue: 462e7, drawdown: 0 }
    ]
  },
  {
    id: "port-quant-cross-2",
    code: "AG-GLOBAL-MULTI",
    name: "AlphaGen Cross-Asset Volatility & Carry",
    mandate: "Multi-asset market-neutral systematic strategy generating uncorrelated return streams via volatility arbitrage and FX/Rates carry.",
    aum: 72e8,
    // $7.2B
    cashBalance: 72e7,
    // 10% cash
    currency: "USD",
    benchmark: "SOFR + 450bps",
    totalPnL: 7488e5,
    totalPnLPercent: 11.61,
    dailyPnL: 142e5,
    dailyPnLPercent: 0.2,
    ytdReturn: 12.85,
    targetVolatility: 7.5,
    currentRegime: "volatility_driven",
    riskMetrics: {
      var95: -0.95,
      var99: -1.58,
      cvar95: -1.45,
      sharpeRatio: 2.45,
      sortinoRatio: 3.1,
      maxDrawdownHistorical: -4.8,
      maxDrawdownExpected: -3.6,
      volatilityAnnualized: 6.8,
      betaToSP500: 0.12,
      stressCrisis2008Drawdown: -7.5,
      stressCovid2020Drawdown: -5.8,
      stressRateHike2022Drawdown: -4.2,
      activeFactorRisk: 1.8
    },
    holdings: [
      {
        id: "hm-1",
        symbol: "UST10Y_FUT",
        name: "US 10Y Ultra Bond Futures",
        assetClass: "Fixed Income",
        sector: "Sovereign Debt",
        quantity: 12500,
        avgCost: 110.25,
        currentPrice: 112.4,
        marketValue: 1405e6,
        weight: 19.51,
        unrealizedPnL: 26875e3,
        unrealizedPnLPercent: 1.95,
        dailyReturn: 0.18
      },
      {
        id: "hm-2",
        symbol: "SPX_VOL_SWAP",
        name: "S&P 500 3M Variance Swap Long",
        assetClass: "Derivatives",
        sector: "Equity Index Volatility",
        quantity: 85e3,
        avgCost: 14.8,
        currentPrice: 16.4,
        marketValue: 1045e6,
        weight: 14.51,
        unrealizedPnL: 136e5,
        unrealizedPnLPercent: 1.32,
        dailyReturn: 1.25
      },
      {
        id: "hm-3",
        symbol: "EURUSD_FWD",
        name: "EUR/USD 6M Basis Swap (Short EUR)",
        assetClass: "Cash / FX",
        sector: "G10 Currencies",
        quantity: 8e8,
        avgCost: 1.092,
        currentPrice: 1.081,
        marketValue: 8648e5,
        weight: 12.01,
        unrealizedPnL: 88e5,
        unrealizedPnLPercent: 1.03,
        dailyReturn: 0.15
      },
      {
        id: "hm-4",
        symbol: "USD_CASH",
        name: "Treasury Collateral & Overnight SOFR",
        assetClass: "Cash / FX",
        sector: "Cash Equivalents",
        quantity: 72e7,
        avgCost: 1,
        currentPrice: 1,
        marketValue: 72e7,
        weight: 10,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0,
        dailyReturn: 0.015
      }
    ],
    historicalPerformance: [
      { date: "2024-01-02", portfolioValue: 641e7, benchmarkValue: 641e7, drawdown: 0 },
      { date: "2024-03-01", portfolioValue: 658e7, benchmarkValue: 65e8, drawdown: -0.4 },
      { date: "2024-05-01", portfolioValue: 672e7, benchmarkValue: 66e8, drawdown: -0.6 },
      { date: "2024-07-01", portfolioValue: 689e7, benchmarkValue: 671e7, drawdown: -0.3 },
      { date: "2024-09-01", portfolioValue: 704e7, benchmarkValue: 682e7, drawdown: -0.5 },
      { date: "2024-11-15", portfolioValue: 72e8, benchmarkValue: 693e7, drawdown: 0 }
    ]
  }
];
var INITIAL_FACTOR_EXPOSURES = {
  "port-quant-alpha-1": [
    {
      factor: "Market Beta",
      loading: 0.88,
      benchmarkLoading: 1,
      activeExposure: -0.12,
      tStat: 8.45,
      standardDeviations60d: 0.42,
      driftAlert: false,
      description: "Systematic equity market exposure calibrated with 60-day rolling Newey-West regression."
    },
    {
      factor: "Momentum",
      loading: 1.68,
      benchmarkLoading: 0.08,
      activeExposure: 1.6,
      tStat: 5.12,
      standardDeviations60d: 2.14,
      driftAlert: true,
      description: "Price & earnings momentum loadings elevated following semiconductor & cloud infrastructure rally. Drift alert active (>2.0 SD)."
    },
    {
      factor: "Quality",
      loading: 1.25,
      benchmarkLoading: 0.15,
      activeExposure: 1.1,
      tStat: 4.8,
      standardDeviations60d: 1.2,
      driftAlert: false,
      description: "High return-on-equity and strong balance sheet characteristics over-indexed to buffer drawdown."
    },
    {
      factor: "Growth",
      loading: 1.4,
      benchmarkLoading: 0.2,
      activeExposure: 1.2,
      tStat: 4.1,
      standardDeviations60d: 1.45,
      driftAlert: false,
      description: "Trailing 3-year revenue growth and forward EPS revision tilt."
    },
    {
      factor: "Value",
      loading: -0.74,
      benchmarkLoading: 0.05,
      activeExposure: -0.79,
      tStat: -3.25,
      standardDeviations60d: -1.65,
      driftAlert: false,
      description: "Negative tilt to traditional book-to-market due to overweight high-multiple AI hardware names."
    },
    {
      factor: "Size",
      loading: -0.85,
      benchmarkLoading: -0.1,
      activeExposure: -0.75,
      tStat: -4.1,
      standardDeviations60d: -1.3,
      driftAlert: false,
      description: "Mega-cap concentration tilt reflecting institutional liquidity constraints."
    },
    {
      factor: "Volatility",
      loading: 0.35,
      benchmarkLoading: 0,
      activeExposure: 0.35,
      tStat: 1.82,
      standardDeviations60d: 0.85,
      driftAlert: false,
      description: "Realized 30d idiosyncratic volatility loading across active equity positions."
    }
  ],
  "port-quant-cross-2": [
    {
      factor: "Market Beta",
      loading: 0.12,
      benchmarkLoading: 0,
      activeExposure: 0.12,
      tStat: 1.4,
      standardDeviations60d: 0.2,
      driftAlert: false,
      description: "Market-neutral beta profile across multi-asset cross-hedges."
    },
    {
      factor: "Volatility",
      loading: -1.35,
      benchmarkLoading: 0,
      activeExposure: -1.35,
      tStat: -4.85,
      standardDeviations60d: -1.9,
      driftAlert: false,
      description: "Short implied-vs-realized variance spread posture harvest."
    },
    {
      factor: "Yield / Carry",
      loading: 2.15,
      benchmarkLoading: 0.5,
      activeExposure: 1.65,
      tStat: 6.2,
      standardDeviations60d: 2.05,
      driftAlert: true,
      description: "G10 interest rate differential carry loading with currency hedge. Drift alert active."
    },
    {
      factor: "Momentum",
      loading: 0.45,
      benchmarkLoading: 0,
      activeExposure: 0.45,
      tStat: 2.1,
      standardDeviations60d: 0.65,
      driftAlert: false,
      description: "Cross-asset trend-following component in sovereign bond curves."
    }
  ]
};
var INITIAL_SECTORS = {
  "port-quant-alpha-1": [
    { sector: "Information Technology", weight: 34.03, benchmarkWeight: 29.5, activeWeight: 4.53, contributionToRisk: 48.2 },
    { sector: "Consumer Discretionary", weight: 12.4, benchmarkWeight: 10.2, activeWeight: 2.2, contributionToRisk: 14.5 },
    { sector: "Health Care", weight: 11.2, benchmarkWeight: 12.1, activeWeight: -0.9, contributionToRisk: 9.8 },
    { sector: "Financials", weight: 13.5, benchmarkWeight: 13.2, activeWeight: 0.3, contributionToRisk: 11 },
    { sector: "Communication Services", weight: 8.9, benchmarkWeight: 8.8, activeWeight: 0.1, contributionToRisk: 7.4 },
    { sector: "Energy", weight: 5.66, benchmarkWeight: 4.1, activeWeight: 1.56, contributionToRisk: 5.2 },
    { sector: "Industrials", weight: 5.1, benchmarkWeight: 8.4, activeWeight: -3.3, contributionToRisk: 2.6 },
    { sector: "Cash Equivalents", weight: 5, benchmarkWeight: 0, activeWeight: 5, contributionToRisk: 0 }
  ],
  "port-quant-cross-2": [
    { sector: "Sovereign Debt (Rates)", weight: 38.5, benchmarkWeight: 30, activeWeight: 8.5, contributionToRisk: 34.2 },
    { sector: "Equity Index Volatility", weight: 26.2, benchmarkWeight: 20, activeWeight: 6.2, contributionToRisk: 42.1 },
    { sector: "G10 Currencies (FX)", weight: 25.3, benchmarkWeight: 20, activeWeight: 5.3, contributionToRisk: 23.7 },
    { sector: "Cash Collateral", weight: 10, benchmarkWeight: 10, activeWeight: 0, contributionToRisk: 0 }
  ]
};
var INITIAL_SIMULATIONS = [
  {
    id: "sim-mc-9901",
    runTimestamp: "2024-11-15T09:42:18Z",
    strategyId: "prop-mom-401",
    strategyName: "Semiconductor Momentum Continuation & Rebalancing",
    portfolioId: "port-quant-alpha-1",
    status: "VALIDATED",
    pathsCount: 1e4,
    instrumentsCount: 400,
    computeDurationMs: 116,
    assumptions: {
      volatilityModel: "Heston Stochastic Volatility (Numba JIT)",
      jumpDiffusion: true,
      covarianceEstimation: "PCA Shrinkage Estimator (60d window, Newey-West)",
      timeHorizonDays: 30,
      confidenceInterval: 99,
      almgrenChrissHorizonMin: 30
    },
    metrics: {
      expectedReturn30d: 3.42,
      var95: -1.35,
      var99: -2.18,
      cvar95: -2.52,
      sharpeDistribution: { min: 1.75, median: 2.38, max: 2.95 },
      maxDrawdownProb95: -4.6,
      hitRateProbability: 71.2,
      estimatedSlippageBps: 3.8
    },
    distributionPaths: [
      { timeStep: 0, p5: 0, p25: 0, median: 0, p75: 0, p95: 0 },
      { timeStep: 5, p5: -0.9, p25: -0.1, median: 0.6, p75: 1.3, p95: 2.2 },
      { timeStep: 10, p5: -1.3, p25: 0.3, median: 1.2, p75: 2.1, p95: 3.5 },
      { timeStep: 15, p5: -1.6, p25: 0.8, median: 1.9, p75: 3, p95: 4.8 },
      { timeStep: 20, p5: -1.8, p25: 1.2, median: 2.5, p75: 3.8, p95: 5.9 },
      { timeStep: 25, p5: -2, p25: 1.6, median: 3, p75: 4.5, p95: 6.8 },
      { timeStep: 30, p5: -2.18, p25: 1.9, median: 3.42, p75: 5.1, p95: 7.6 }
    ],
    riskCheckOutcome: {
      passed: true,
      varCheckPassed: true,
      concentrationLimitPassed: true,
      liquidityFloorPassed: true,
      vetoTriggered: false
    }
  },
  {
    id: "sim-mc-9902",
    runTimestamp: "2024-11-15T10:14:05Z",
    strategyId: "prop-vol-402",
    strategyName: "VIX Term Structure Mean-Reverting Spread",
    portfolioId: "port-quant-cross-2",
    status: "VALIDATED",
    pathsCount: 1e4,
    instrumentsCount: 400,
    computeDurationMs: 112,
    assumptions: {
      volatilityModel: "Heston Stochastic Volatility (Numba JIT)",
      jumpDiffusion: true,
      covarianceEstimation: "PCA Shrinkage Estimator (60d window, Newey-West)",
      timeHorizonDays: 30,
      confidenceInterval: 99,
      almgrenChrissHorizonMin: 45
    },
    metrics: {
      expectedReturn30d: 2.15,
      var95: -0.88,
      var99: -1.45,
      cvar95: -1.62,
      sharpeDistribution: { min: 2.05, median: 2.62, max: 3.2 },
      maxDrawdownProb95: -3.2,
      hitRateProbability: 76.5,
      estimatedSlippageBps: 4.5
    },
    distributionPaths: [
      { timeStep: 0, p5: 0, p25: 0, median: 0, p75: 0, p95: 0 },
      { timeStep: 5, p5: -0.5, p25: 0.1, median: 0.4, p75: 0.8, p95: 1.4 },
      { timeStep: 10, p5: -0.8, p25: 0.3, median: 0.8, p75: 1.4, p95: 2.1 },
      { timeStep: 15, p5: -1.1, p25: 0.6, median: 1.2, p75: 1.9, p95: 2.9 },
      { timeStep: 20, p5: -1.2, p25: 0.9, median: 1.6, p75: 2.3, p95: 3.5 },
      { timeStep: 25, p5: -1.35, p25: 1.1, median: 1.9, p75: 2.7, p95: 4.1 },
      { timeStep: 30, p5: -1.45, p25: 1.3, median: 2.15, p75: 3.1, p95: 4.8 }
    ],
    riskCheckOutcome: {
      passed: true,
      varCheckPassed: true,
      concentrationLimitPassed: true,
      liquidityFloorPassed: true,
      vetoTriggered: false
    }
  },
  {
    id: "sim-mc-9903",
    runTimestamp: "2024-11-15T10:48:30Z",
    strategyId: "prop-mr-403",
    strategyName: "Energy Factor Disconnect & Mean Reversion Arbitrage",
    portfolioId: "port-quant-alpha-1",
    status: "VALIDATED",
    pathsCount: 1e4,
    instrumentsCount: 400,
    computeDurationMs: 119,
    assumptions: {
      volatilityModel: "Heston Stochastic Volatility (Numba JIT)",
      jumpDiffusion: true,
      covarianceEstimation: "PCA Shrinkage Estimator (60d window, Newey-West)",
      timeHorizonDays: 30,
      confidenceInterval: 99,
      almgrenChrissHorizonMin: 30
    },
    metrics: {
      expectedReturn30d: 1.95,
      var95: -1.1,
      var99: -1.85,
      cvar95: -2.05,
      sharpeDistribution: { min: 1.5, median: 2.1, max: 2.7 },
      maxDrawdownProb95: -3.9,
      hitRateProbability: 64.8,
      estimatedSlippageBps: 2.9
    },
    distributionPaths: [
      { timeStep: 0, p5: 0, p25: 0, median: 0, p75: 0, p95: 0 },
      { timeStep: 5, p5: -0.7, p25: -0.1, median: 0.3, p75: 0.7, p95: 1.5 },
      { timeStep: 10, p5: -1, p25: 0.2, median: 0.7, p75: 1.3, p95: 2.3 },
      { timeStep: 15, p5: -1.3, p25: 0.5, median: 1.1, p75: 1.8, p95: 3.1 },
      { timeStep: 20, p5: -1.5, p25: 0.8, median: 1.4, p75: 2.2, p95: 3.8 },
      { timeStep: 25, p5: -1.7, p25: 1, median: 1.7, p75: 2.6, p95: 4.4 },
      { timeStep: 30, p5: -1.85, p25: 1.2, median: 1.95, p75: 3, p95: 5.1 }
    ],
    riskCheckOutcome: {
      passed: true,
      varCheckPassed: true,
      concentrationLimitPassed: true,
      liquidityFloorPassed: true,
      vetoTriggered: false
    }
  },
  {
    id: "sim-mc-9904",
    runTimestamp: "2024-11-14T15:20:10Z",
    strategyId: "prop-carry-404",
    strategyName: "Aggressive Emerging FX Carry Rotation",
    portfolioId: "port-quant-cross-2",
    status: "FAILED_RISK_CHECK",
    pathsCount: 1e4,
    instrumentsCount: 400,
    computeDurationMs: 122,
    assumptions: {
      volatilityModel: "Heston Stochastic Volatility (Numba JIT)",
      jumpDiffusion: true,
      covarianceEstimation: "PCA Shrinkage Estimator (60d window, Newey-West)",
      timeHorizonDays: 30,
      confidenceInterval: 99,
      almgrenChrissHorizonMin: 30
    },
    metrics: {
      expectedReturn30d: 4.8,
      var95: -2.85,
      var99: -4.92,
      cvar95: -5.4,
      sharpeDistribution: { min: 0.85, median: 1.45, max: 2.1 },
      maxDrawdownProb95: -9.8,
      hitRateProbability: 54,
      estimatedSlippageBps: 18.5
    },
    distributionPaths: [
      { timeStep: 0, p5: 0, p25: 0, median: 0, p75: 0, p95: 0 },
      { timeStep: 5, p5: -2.2, p25: -0.4, median: 0.8, p75: 1.9, p95: 3.5 },
      { timeStep: 10, p5: -3.1, p25: 0, median: 1.5, p75: 2.8, p95: 5.2 },
      { timeStep: 15, p5: -3.9, p25: 0.3, median: 2.3, p75: 3.9, p95: 7.1 },
      { timeStep: 20, p5: -4.4, p25: 0.6, median: 3.1, p75: 5, p95: 8.8 },
      { timeStep: 25, p5: -4.7, p25: 0.8, median: 3.9, p75: 6.2, p95: 10.4 },
      { timeStep: 30, p5: -4.92, p25: 1.1, median: 4.8, p75: 7.4, p95: 12.1 }
    ],
    riskCheckOutcome: {
      passed: false,
      varCheckPassed: false,
      concentrationLimitPassed: true,
      liquidityFloorPassed: false,
      vetoTriggered: true,
      vetoReason: "Portfolio 99% VaR exceeds mandate limit (-2.50%). Projected trade size exceeds 5% ADV illiquidity threshold in target currency forward."
    }
  }
];
var INITIAL_PROPOSALS = [
  {
    id: "prop-mom-401",
    code: "PROP-2024-MOM-401",
    title: "Semiconductor Momentum Continuation & Rebalancing",
    category: "momentum",
    portfolioId: "port-quant-alpha-1",
    portfolioCode: "AG-ALPHA-EQ",
    createdAt: "2024-11-15T09:45:00Z",
    status: "pending",
    urgency: "HIGH",
    confidenceScore: 89,
    triggerEvent: "NVDA & AVGO factor loadings exceeded +2.1 SD 60-day momentum threshold; earnings revision upgrade cycle detected via Refinitiv streaming feed.",
    thesis: "Sustain upside participation in mega-cap semiconductor AI infrastructure rally while locking in 80bps gains and re-allocating across high Sharpe names to remain inside sector concentration limits.",
    rationale: [
      "Momentum factor loading stands at +1.68 with high statistical significance (t-stat 5.12).",
      "Refinitiv consensus forward earnings revisions adjusted +4.2% higher over the last 48 hours.",
      "Almgren-Chriss market impact model projects 3.8 bps execution drag over a 30-minute slicing horizon.",
      "Monte Carlo 10,000-path simulation indicates a 71.2% probability of achieving target 30-day alpha."
    ],
    supportingFactorSignals: [
      { factor: "Momentum Loading", observedValue: "+1.68 z-score", signalStrength: "Strong Positive", zScore: 2.14 },
      { factor: "Quality / ROE", observedValue: "38.4% Net Margin", signalStrength: "Strong Positive", zScore: 1.85 },
      { factor: "Earnings Revisions", observedValue: "+4.2% 7-day diff", signalStrength: "Positive", zScore: 1.62 },
      { factor: "Realized Volatility", observedValue: "32.5% annualized", signalStrength: "Neutral", zScore: 0.45 }
    ],
    expectedImpact: {
      expectedReturn: 3.42,
      expectedSharpeDelta: 0.2,
      portfolioVarDelta: -0.07,
      turnover: 1.85,
      estimatedTransactionCostsBps: 3.8
    },
    trades: [
      {
        symbol: "NVDA",
        action: "BUY",
        shares: 45e3,
        estimatedPrice: 134.8,
        notionalValue: 6066e3,
        targetWeightDelta: 0.12,
        advPercentage: 0.85,
        executionStyle: "Almgren-Chriss Optimal Slicing"
      },
      {
        symbol: "AVGO",
        action: "BUY",
        shares: 35e3,
        estimatedPrice: 172.4,
        notionalValue: 6034e3,
        targetWeightDelta: 0.12,
        advPercentage: 1.15,
        executionStyle: "Almgren-Chriss Optimal Slicing"
      },
      {
        symbol: "XOM",
        action: "SELL",
        shares: 1e5,
        estimatedPrice: 119.3,
        notionalValue: 1193e4,
        targetWeightDelta: -0.24,
        advPercentage: 0.62,
        executionStyle: "TWAP 30m"
      }
    ],
    riskChecks: [
      { name: "VaR 99% Constraint Check", passed: true, details: "Post-trade VaR 99% is -2.28% (under -2.50% mandate ceiling).", severity: "pass" },
      { name: "Sector Exposure Ceiling (Tech < 35%)", passed: true, details: "Tech sector weight adjusts from 34.03% to 34.27% (limit 35.0%).", severity: "pass" },
      { name: "Single-Stock Max Weight (< 12%)", passed: true, details: "NVDA weight after reallocation is 10.13% (well within 12.0% cap).", severity: "pass" },
      { name: "Liquidity Floor (< 5% ADV)", passed: true, details: "Max trade ADV participation is 1.15% on AVGO (safe threshold <5%).", severity: "pass" }
    ],
    simulationId: "sim-mc-9901"
  },
  {
    id: "prop-vol-402",
    code: "PROP-2024-VOL-402",
    title: "VIX Term Structure Mean-Reverting Spread",
    category: "volatility_arbitrage",
    portfolioId: "port-quant-cross-2",
    portfolioCode: "AG-GLOBAL-MULTI",
    createdAt: "2024-11-15T10:15:00Z",
    status: "pending",
    urgency: "MEDIUM",
    confidenceScore: 84,
    triggerEvent: "1M/3M VIX futures curve steepness inverted beyond 95th percentile historical threshold during morning macro announcement.",
    thesis: "Exploit structural steepening in the 1M-to-3M volatility term structure by selling rich front-month variance swap while buying deferred contract.",
    rationale: [
      "Term structure curvature spread widened to 2.4 vol points, exceeding 60-day historical bounds.",
      "Hidden Markov Model regime classifier flags market state as volatility-driven regime with high mean-reversion probability.",
      "Net delta to underlying equity index remains within +/- 0.05 tolerance.",
      "Precomputed Numba simulation validates 76.5% win rate over 30 days."
    ],
    supportingFactorSignals: [
      { factor: "Term Structure Slope", observedValue: "2.4 vol pts", signalStrength: "Strong Positive", zScore: 2.3 },
      { factor: "Variance Risk Premium", observedValue: "3.1% IV vs RV", signalStrength: "Positive", zScore: 1.75 },
      { factor: "Cross-Asset Vol Correlation", observedValue: "0.42 (low)", signalStrength: "Positive", zScore: 1.1 }
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
        symbol: "SPX_VOL_SWAP_1M",
        action: "SELL",
        shares: 25e3,
        estimatedPrice: 17.8,
        notionalValue: 445e6,
        targetWeightDelta: -6.18,
        advPercentage: 2.4,
        executionStyle: "VWAP 45m"
      },
      {
        symbol: "SPX_VOL_SWAP_3M",
        action: "BUY",
        shares: 26e3,
        estimatedPrice: 15.4,
        notionalValue: 4004e5,
        targetWeightDelta: 5.56,
        advPercentage: 1.95,
        executionStyle: "VWAP 45m"
      }
    ],
    riskChecks: [
      { name: "VaR 99% Constraint Check", passed: true, details: "Cross-asset VaR 99% remains at -1.53% (limit -2.00%).", severity: "pass" },
      { name: "Vega Sensitivity Cap ($2.5M/vol point)", passed: true, details: "Net portfolio vega after hedge is +$1.15M/point.", severity: "pass" },
      { name: "Liquidity Floor (< 5% ADV)", passed: true, details: "Front month tranche represents 2.40% ADV (limit < 5%).", severity: "pass" }
    ],
    simulationId: "sim-mc-9902"
  },
  {
    id: "prop-mr-403",
    code: "PROP-2024-MR-403",
    title: "Energy Factor Disconnect & Mean Reversion Arbitrage",
    category: "mean_reversion",
    portfolioId: "port-quant-alpha-1",
    portfolioCode: "AG-ALPHA-EQ",
    createdAt: "2024-11-15T10:50:00Z",
    status: "pending",
    urgency: "LOW",
    confidenceScore: 78,
    triggerEvent: "Energy sector factor loading deviated -1.65 SD from 60-day mean following localized commodity inventory release.",
    thesis: "Rebalance temporary dislocation between integrated oil valuations and crude prompt futures curve through sector pairs re-weighting.",
    rationale: [
      "Rolling regression indicates oil major discount to underlying asset NAV is 2.8 standard deviations.",
      "Mean-reversion half-life estimated at 8.4 trading days.",
      "Almgren-Chriss estimated execution slippage is minimal (2.9 bps)."
    ],
    supportingFactorSignals: [
      { factor: "Value Factor Spread", observedValue: "-1.65 SD", signalStrength: "Positive", zScore: -1.65 },
      { factor: "Commodity Basis", observedValue: "+1.4% Backwardation", signalStrength: "Neutral", zScore: 0.85 }
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
        symbol: "XOM",
        action: "BUY",
        shares: 35e3,
        estimatedPrice: 119.3,
        notionalValue: 4175500,
        targetWeightDelta: 0.08,
        advPercentage: 0.4,
        executionStyle: "TWAP 30m"
      }
    ],
    riskChecks: [
      { name: "VaR 99% Constraint Check", passed: true, details: "Portfolio VaR 99% impact is +0.02% (well within tolerance).", severity: "pass" },
      { name: "Sector Exposure Ceiling", passed: true, details: "Energy sector remains at 5.74% (cap is 10.0%).", severity: "pass" }
    ],
    simulationId: "sim-mc-9903"
  },
  {
    id: "prop-carry-404",
    code: "PROP-2024-CARRY-404",
    title: "Aggressive Emerging FX Carry Rotation",
    category: "carry",
    portfolioId: "port-quant-cross-2",
    portfolioCode: "AG-GLOBAL-MULTI",
    createdAt: "2024-11-14T15:25:00Z",
    status: "rejected",
    urgency: "HIGH",
    confidenceScore: 52,
    triggerEvent: "High yield spread opportunity triggered in Latin American currency swap forward markets.",
    thesis: "Capture 480bps annualized carry yield by funding short JPY and long high-beta currency swap contracts.",
    rationale: [
      "Autonomous Carry Agent proposed high notional deployment to capture interest rate differential.",
      "However, Risk Assessment Agent simulation detected extreme tail risk in currency gap events."
    ],
    supportingFactorSignals: [
      { factor: "Carry Yield Spread", observedValue: "480 bps", signalStrength: "Strong Positive", zScore: 2.8 },
      { factor: "Tail Jump Volatility", observedValue: "High Jump Risk", signalStrength: "Negative", zScore: -2.4 }
    ],
    expectedImpact: {
      expectedReturn: 4.8,
      expectedSharpeDelta: -0.15,
      portfolioVarDelta: 0.72,
      turnover: 4.2,
      estimatedTransactionCostsBps: 18.5
    },
    trades: [
      {
        symbol: "BRL_USD_NDF",
        action: "BUY",
        shares: 15e7,
        estimatedPrice: 5.72,
        notionalValue: 858e6,
        targetWeightDelta: 11.91,
        advPercentage: 8.4,
        executionStyle: "TWAP 30m"
      }
    ],
    riskChecks: [
      { name: "VaR 99% Constraint Check", passed: false, details: "Projected VaR 99% jumped to -4.92%, violating mandate limit of -2.50%.", severity: "fail" },
      { name: "Liquidity Floor (< 5% ADV)", passed: false, details: "Trade size is 8.40% ADV, exceeding the 5% illiquidity floor.", severity: "fail" }
    ],
    simulationId: "sim-mc-9904",
    decisionMetadata: {
      decidedAt: "2024-11-14T15:30:12Z",
      decidedBy: "Risk Assessment Agent (Automatic Veto) & PM Review",
      decision: "REJECTED",
      notes: "Mandate risk limits violated. Trade illiquidity (8.40% ADV) and tail jump probability rejected under crisis stress-test scenarios."
    }
  }
];
var INITIAL_AUDIT_LOGS = [
  {
    id: "log-101",
    timestamp: "2024-11-15T10:50:00Z",
    type: "PROPOSAL_GENERATED",
    portfolioCode: "AG-ALPHA-EQ",
    summary: "Mean-reversion strategy proposal generated (PROP-2024-MR-403)",
    details: "Triggered by 1.65 SD energy factor disconnect from 60-day rolling baseline.",
    actor: "Autonomous Agent",
    relatedProposalId: "prop-mr-403",
    relatedSimulationId: "sim-mc-9903"
  },
  {
    id: "log-102",
    timestamp: "2024-11-15T10:48:30Z",
    type: "SIMULATION_COMPLETED",
    portfolioCode: "AG-ALPHA-EQ",
    summary: "Numba Monte Carlo simulation finished in 119ms (sim-mc-9903)",
    details: "10,000 paths evaluated across 400 instruments. Risk check outcome: PASSED.",
    actor: "Risk Engine (Numba)",
    relatedSimulationId: "sim-mc-9903"
  },
  {
    id: "log-103",
    timestamp: "2024-11-15T10:15:00Z",
    type: "PROPOSAL_GENERATED",
    portfolioCode: "AG-GLOBAL-MULTI",
    summary: "Volatility arbitrage proposal generated (PROP-2024-VOL-402)",
    details: "Triggered by 95th percentile VIX term structure steepness anomaly.",
    actor: "Autonomous Agent",
    relatedProposalId: "prop-vol-402",
    relatedSimulationId: "sim-mc-9902"
  },
  {
    id: "log-104",
    timestamp: "2024-11-15T09:45:00Z",
    type: "PROPOSAL_GENERATED",
    portfolioCode: "AG-ALPHA-EQ",
    summary: "Momentum rebalancing proposal generated (PROP-2024-MOM-401)",
    details: "Semiconductor momentum loadings exceeded +2.1 SD. Expected alpha +3.42%.",
    actor: "Autonomous Agent",
    relatedProposalId: "prop-mom-401",
    relatedSimulationId: "sim-mc-9901"
  },
  {
    id: "log-105",
    timestamp: "2024-11-14T15:30:12Z",
    type: "PROPOSAL_REJECTED",
    portfolioCode: "AG-GLOBAL-MULTI",
    summary: "Proposal PROP-2024-CARRY-404 automatically vetoed & rejected",
    details: "Violated VaR 99% cap (-4.92% vs -2.50%) and ADV liquidity floor (8.40% ADV).",
    actor: "Portfolio Manager (Human)",
    relatedProposalId: "prop-carry-404",
    relatedSimulationId: "sim-mc-9904"
  }
];

// src/server/users.ts
var DEFAULT_PASSWORD_PLAIN = "alphagen2024";
var DEFAULT_PASSWORD_HASH = "$2b$10$uZB3gYVysgP0Sp5NjbmQqublihlCTQLhG6Kb6D59lYO.4PZ8V4OzG";
var SEEDED_USERS = [
  {
    id: "user-pm-101",
    name: "Elena Rostova",
    email: "pm@alphagen.internal",
    role: "PORTFOLIO_MANAGER",
    title: "Senior Portfolio Manager (Alpha Mandates)",
    department: "Quantitative Equity Strategies",
    passwordHash: DEFAULT_PASSWORD_HASH
  },
  {
    id: "user-risk-202",
    name: "Marcus Vance",
    email: "risk@alphagen.internal",
    role: "RISK_ANALYST",
    title: "Head of Market Risk & Stress Testing",
    department: "Institutional Risk Oversight",
    passwordHash: DEFAULT_PASSWORD_HASH
  },
  {
    id: "user-quant-303",
    name: "Dr. Liam Thorne",
    email: "quant@alphagen.internal",
    role: "QUANT_RESEARCHER",
    title: "Principal Quantitative Researcher",
    department: "Multi-Asset Model Development",
    passwordHash: DEFAULT_PASSWORD_HASH
  }
];

// src/server/db.ts
if (!process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch {
  }
}
dotenv.config();
var uri = process.env.MONGODB_URI || "";
var dbName = process.env.DB_NAME || "alphagen_db";
var client = null;
var dbInstance = null;
var connectPromise = null;
async function connectToDatabase() {
  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment variables.");
  }
  if (dbInstance) {
    return { db: dbInstance, isConnected: true };
  }
  if (connectPromise) {
    return connectPromise;
  }
  connectPromise = (async () => {
    try {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 2500,
        connectTimeoutMS: 2500
      });
      await client.connect();
      dbInstance = client.db(dbName);
      console.log(`[MongoDB] Connected to database: ${dbName}`);
      await seedDatabaseIfEmpty(dbInstance).catch((err) => {
        console.warn("[MongoDB] Seeding error:", err.message);
      });
      return { db: dbInstance, isConnected: true };
    } catch (err) {
      connectPromise = null;
      throw err;
    }
  })();
  return connectPromise;
}
function getDatabase() {
  return dbInstance;
}
async function seedDatabaseIfEmpty(db) {
  const usersCol = db.collection("users");
  const portfoliosCol = db.collection("portfolios");
  const proposalsCol = db.collection("proposals");
  const simulationsCol = db.collection("simulations");
  const factorsCol = db.collection("factorExposures");
  const sectorsCol = db.collection("sectorExposures");
  const auditLogsCol = db.collection("auditLogs");
  const userCount = await usersCol.countDocuments();
  if (userCount === 0) {
    console.log("[MongoDB Seed] Seeding default institutional users...");
    await usersCol.insertMany(SEEDED_USERS.map((u) => ({ ...u })));
  }
  const portfolioCount = await portfoliosCol.countDocuments();
  if (portfolioCount === 0) {
    console.log("[MongoDB Seed] Seeding initial portfolios...");
    await portfoliosCol.insertMany(INITIAL_PORTFOLIOS.map((p) => ({ ...p })));
  }
  const proposalCount = await proposalsCol.countDocuments();
  if (proposalCount === 0) {
    console.log("[MongoDB Seed] Seeding initial strategy proposals...");
    await proposalsCol.insertMany(INITIAL_PROPOSALS.map((p) => ({ ...p })));
  }
  const simCount = await simulationsCol.countDocuments();
  if (simCount === 0) {
    console.log("[MongoDB Seed] Seeding initial simulations...");
    await simulationsCol.insertMany(INITIAL_SIMULATIONS.map((s) => ({ ...s })));
  }
  const factorCount = await factorsCol.countDocuments();
  if (factorCount === 0) {
    console.log("[MongoDB Seed] Seeding initial factor exposures...");
    const factorDocs = Object.entries(INITIAL_FACTOR_EXPOSURES).map(([portfolioId, items]) => ({
      portfolioId,
      items
    }));
    await factorsCol.insertMany(factorDocs);
  }
  const sectorCount = await sectorsCol.countDocuments();
  if (sectorCount === 0) {
    console.log("[MongoDB Seed] Seeding initial sector exposures...");
    const sectorDocs = Object.entries(INITIAL_SECTORS).map(([portfolioId, items]) => ({
      portfolioId,
      items
    }));
    await sectorsCol.insertMany(sectorDocs);
  }
  const auditCount = await auditLogsCol.countDocuments();
  if (auditCount === 0) {
    console.log("[MongoDB Seed] Seeding initial audit history...");
    await auditLogsCol.insertMany(INITIAL_AUDIT_LOGS.map((a) => ({ ...a })));
  }
}
async function resetDatabase(db) {
  await db.collection("users").deleteMany({});
  await db.collection("portfolios").deleteMany({});
  await db.collection("proposals").deleteMany({});
  await db.collection("simulations").deleteMany({});
  await db.collection("factorExposures").deleteMany({});
  await db.collection("sectorExposures").deleteMany({});
  await db.collection("auditLogs").deleteMany({});
  await seedDatabaseIfEmpty(db);
}

// src/server/routes/auth.ts
import { Router } from "express";
import bcrypt from "bcryptjs";

// src/server/middleware/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "alphagen_institutional_jwt_secret_dev_2024";
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required. Missing Bearer token." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session token. Please log in again." });
  }
}

// src/server/routes/auth.ts
var authRouter = Router();
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    let matchedUser = null;
    const db = getDatabase();
    if (db) {
      matchedUser = await db.collection("users").findOne({ email: normalizedEmail });
    }
    if (!matchedUser) {
      matchedUser = SEEDED_USERS.find((u) => u.email.toLowerCase() === normalizedEmail);
    }
    if (!matchedUser) {
      return res.status(401).json({ error: "Invalid credentials. Unknown user account." });
    }
    const passwordValid = await bcrypt.compare(password, matchedUser.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid credentials. Incorrect password." });
    }
    const tokenPayload = {
      userId: matchedUser.id,
      email: matchedUser.email,
      role: matchedUser.role,
      name: matchedUser.name
    };
    const token = generateToken(tokenPayload);
    const userProfile = {
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
  } catch (err) {
    console.error("[Auth Error] /api/auth/login:", err);
    return res.status(500).json({ error: "Authentication service error." });
  }
});
authRouter.get("/me", requireAuth, async (req, res) => {
  try {
    const userPayload = req.user;
    let profile = null;
    const db = getDatabase();
    if (db) {
      profile = await db.collection("users").findOne(
        { id: userPayload.userId },
        { projection: { passwordHash: 0, _id: 0 } }
      );
    }
    if (!profile) {
      const seeded = SEEDED_USERS.find((u) => u.id === userPayload.userId);
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
      return res.status(404).json({ error: "User not found." });
    }
    return res.json({ user: profile });
  } catch (err) {
    return res.status(500).json({ error: "Failed to retrieve profile." });
  }
});
authRouter.get("/seeded-accounts", (req, res) => {
  const accounts = SEEDED_USERS.map((u) => ({
    name: u.name,
    email: u.email,
    role: u.role,
    title: u.title,
    department: u.department,
    defaultPassword: DEFAULT_PASSWORD_PLAIN
  }));
  res.json(accounts);
});

// src/server/index.ts
if (!process.env.VERCEL) {
  try {
    dns2.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch {
  }
}
dotenv2.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 5e3;
var FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
if (FRONTEND_ORIGIN) {
  app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
} else {
  app.use(cors());
}
app.use(express.json());
var hasAttemptedDbInit = false;
app.use(async (req, _res, next) => {
  if (process.env.VERCEL && !req.url.startsWith("/api")) {
    req.url = "/api" + req.url;
  }
  if (!getDatabase() && process.env.MONGODB_URI && !hasAttemptedDbInit) {
    hasAttemptedDbInit = true;
    try {
      await connectToDatabase();
    } catch (err) {
      console.warn("[MongoDB Warning] API operating in fallback mock mode:", err.message);
    }
  }
  next();
});
app.use("/api/auth", authRouter);
app.get("/api/status", async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json({
        connected: false,
        message: "MongoDB URI not yet configured or connecting. Operating in fallback mock mode."
      });
    }
    await db.command({ ping: 1 });
    return res.json({
      connected: true,
      database: db.databaseName,
      message: "MongoDB Atlas connected successfully."
    });
  } catch (error) {
    return res.status(500).json({
      connected: false,
      error: error.message
    });
  }
});
app.get("/api/portfolios", requireAuth, async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json(INITIAL_PORTFOLIOS);
    }
    const portfolios = await db.collection("portfolios").find({}, { projection: { _id: 0 } }).toArray();
    return res.json(portfolios);
  } catch (err) {
    console.error("Error fetching portfolios:", err);
    return res.status(500).json({ error: "Failed to retrieve portfolios" });
  }
});
app.patch("/api/portfolios/:id/deposit", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const depositAmount = Number(amount);
    if (!depositAmount || depositAmount <= 0) {
      return res.status(400).json({ error: "Invalid deposit amount" });
    }
    const db = getDatabase();
    if (!db) {
      const target = INITIAL_PORTFOLIOS.find((p) => p.id === id);
      if (!target) return res.status(404).json({ error: "Portfolio not found" });
      target.cashBalance += depositAmount;
      target.aum += depositAmount;
      return res.json(target);
    }
    const result = await db.collection("portfolios").findOneAndUpdate(
      { id },
      { $inc: { cashBalance: depositAmount, aum: depositAmount } },
      { returnDocument: "after", projection: { _id: 0 } }
    );
    if (!result) {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    return res.json(result);
  } catch (err) {
    console.error("Error depositing funds:", err);
    return res.status(500).json({ error: "Failed to process margin deposit" });
  }
});
app.get("/api/proposals", requireAuth, async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json(INITIAL_PROPOSALS);
    }
    const proposals = await db.collection("proposals").find({}, { projection: { _id: 0 } }).toArray();
    return res.json(proposals);
  } catch (err) {
    console.error("Error fetching proposals:", err);
    return res.status(500).json({ error: "Failed to retrieve proposals" });
  }
});
app.patch("/api/proposals/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const actorUser = req.user;
    const db = getDatabase();
    const decidedBy = actorUser ? `${actorUser.name} (${actorUser.role.replace("_", " ")})` : "Portfolio Manager (Human Token #PM-8921)";
    const decisionMetadata = {
      decidedAt: (/* @__PURE__ */ new Date()).toISOString(),
      decidedBy,
      decision: status === "rejected" ? "REJECTED" : "APPROVED",
      notes: notes || (status === "approved" ? "Proposal approved following multi-factor & Monte Carlo risk verification." : status === "rejected" ? "Proposal rejected by portfolio manager discretion." : "Simulated algorithmic order slicing routed.")
    };
    if (!db) {
      const existing = INITIAL_PROPOSALS.find((p) => p.id === id);
      if (!existing) return res.status(404).json({ error: "Proposal not found" });
      const updated = {
        ...existing,
        status: status || existing.status,
        decisionMetadata
      };
      return res.json(updated);
    }
    const updateFields = { status, decisionMetadata };
    const result = await db.collection("proposals").findOneAndUpdate(
      { id },
      { $set: updateFields },
      { returnDocument: "after", projection: { _id: 0 } }
    );
    if (!result) {
      return res.status(404).json({ error: "Proposal not found" });
    }
    return res.json(result);
  } catch (err) {
    console.error("Error updating proposal:", err);
    return res.status(500).json({ error: "Failed to update proposal" });
  }
});
app.get("/api/simulations", requireAuth, async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json(INITIAL_SIMULATIONS);
    }
    const simulations = await db.collection("simulations").find({}, { projection: { _id: 0 } }).toArray();
    return res.json(simulations);
  } catch (err) {
    console.error("Error fetching simulations:", err);
    return res.status(500).json({ error: "Failed to retrieve simulations" });
  }
});
app.get("/api/factors", requireAuth, async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json(INITIAL_FACTOR_EXPOSURES);
    }
    const factorDocs = await db.collection("factorExposures").find({}, { projection: { _id: 0 } }).toArray();
    const factorMap = {};
    factorDocs.forEach((doc) => {
      factorMap[doc.portfolioId] = doc.items;
    });
    return res.json(factorMap);
  } catch (err) {
    console.error("Error fetching factor exposures:", err);
    return res.status(500).json({ error: "Failed to retrieve factor exposures" });
  }
});
app.get("/api/sectors", requireAuth, async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json(INITIAL_SECTORS);
    }
    const sectorDocs = await db.collection("sectorExposures").find({}, { projection: { _id: 0 } }).toArray();
    const sectorMap = {};
    sectorDocs.forEach((doc) => {
      sectorMap[doc.portfolioId] = doc.items;
    });
    return res.json(sectorMap);
  } catch (err) {
    console.error("Error fetching sector exposures:", err);
    return res.status(500).json({ error: "Failed to retrieve sector exposures" });
  }
});
app.get("/api/audit", requireAuth, async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json(INITIAL_AUDIT_LOGS);
    }
    const logs = await db.collection("auditLogs").find({}, { projection: { _id: 0 } }).sort({ timestamp: -1 }).toArray();
    return res.json(logs);
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    return res.status(500).json({ error: "Failed to retrieve audit logs" });
  }
});
app.post("/api/audit", requireAuth, async (req, res) => {
  try {
    const logItem = req.body;
    if (!logItem || !logItem.id) {
      return res.status(400).json({ error: "Invalid audit log item" });
    }
    if (req.user) {
      logItem.actor = `${req.user.name} (${req.user.role.replace("_", " ")})`;
    }
    const db = getDatabase();
    if (db) {
      await db.collection("auditLogs").insertOne({ ...logItem });
    }
    return res.status(201).json(logItem);
  } catch (err) {
    console.error("Error inserting audit log:", err);
    return res.status(500).json({ error: "Failed to record audit log" });
  }
});
app.post("/api/reset", requireAuth, async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json({ message: "In-memory data reset to baseline." });
    }
    await resetDatabase(db);
    return res.json({ message: "Database reset to default sample baseline successfully." });
  } catch (err) {
    console.error("Error resetting database:", err);
    return res.status(500).json({ error: "Failed to reset database" });
  }
});
var distPath = path.resolve(__dirname, "../../dist");
if (fs.existsSync(distPath)) {
  console.log(`[AlphaGen Server] Single-service mode active: serving static frontend from ${distPath}`);
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(distPath, "index.html"));
    }
    next();
  });
}
async function startServer() {
  try {
    await connectToDatabase();
  } catch (err) {
    console.warn(`[MongoDB Warning] ${err.message}`);
    if (!process.env.MONGODB_URI) {
      console.warn("[MongoDB Warning] API starting in fallback mock mode: MONGODB_URI is not set in .env");
    } else {
      console.warn("[MongoDB Warning] API starting in fallback mock mode because connection to MongoDB failed.");
    }
  }
  app.listen(PORT, () => {
    console.log(`[AlphaGen Backend] Express API running on http://localhost:${PORT}`);
  });
}
if (!process.env.VERCEL) {
  startServer();
}
var index_default = app;

// src/server/serverless.ts
function handler(req, res) {
  return index_default(req, res);
}
export {
  handler as default
};
