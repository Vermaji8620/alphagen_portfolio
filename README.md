# AlphaGen — Autonomous Quant Strategy & Risk Prototype

An institutional-grade quantitative trading platform prototype modeled after the AlphaGen case study specification.

---

## Overview

AlphaGen translates real-time financial market signals, multi-factor exposure models, and Numba-accelerated Monte Carlo simulations into actionable portfolio rebalancing strategy proposals for portfolio managers.

### Implemented Screens & Workflows

1. **Screen A: Portfolio Overview**
   - Live metrics: Total AUM, daily P&L, cumulative P&L, and inception alpha.
   - Interactive rebased historical performance curve with benchmark overlay (S&P 500 / SOFR + 450bps).
   - Dynamic asset & sector allocation breakdown (pie & active tilts).
   - Holdings table enriched with quantity, price, market value, portfolio weight, daily return, and unrealized P&L.
   - Multi-portfolio selector: Switch between **AG-ALPHA-EQ** ($4.85B US Large-Cap Equity Alpha) and **AG-GLOBAL-MULTI** ($7.20B Cross-Asset Volatility & Carry).

2. **Screen B: Strategy Activity & Review**
   - Categorized strategy proposals: **Momentum**, **Mean Reversion**, **Volatility Arbitrage**, and **Carry**.
   - Search, status filtering (Pending, Approved, Rejected, Simulated Executed), and category filtering.
   - Comprehensive detail modal featuring:
     - Trigger event from the Kafka market event stream.
     - Investment thesis and machine-readable agent rationale.
     - Multi-factor signals with statistical Z-scores.
     - Pre-trade execution order legs with Almgren-Chriss algorithmic slicing and ADV liquidity verification.
     - Mandate risk checks (VaR 99%, sector caps, single-stock caps, ADV liquidity floors).
   - **Human-in-the-loop decision making**: Approve or Reject proposals, input PM audit comments, and trigger simulated order routing.

3. **Screen C: Factor Exposures & Risk Analytics**
   - 60-day rolling Newey-West standard error corrected factor regression loadings.
   - Interactive bar chart showing active tilts vs. benchmark and automatic drift alerts (> 2.0 SD).
   - Institutional risk metrics: Value at Risk (VaR 95%, VaR 99%), Conditional VaR (Expected Shortfall), Sharpe & Sortino ratios, and annualized volatility.
   - Stress-scenario analysis evaluating historical crisis replays (2008 Lehman GFC, 2020 COVID-19 flash crash, and 2022 Fed rate hike cycle).

4. **Screen D: Monte Carlo Simulation History**
   - Precomputed Numba JIT-compiled simulation runs (10,000 paths in under 120ms).
   - Interactive 30-day fan chart showing 5th (tail VaR), 25th, 50th (median), 75th, and 95th percentiles.
   - Quantitative outputs: Expected alpha, hit rate probability, max drawdown probability, and estimated slippage in basis points.
   - Direct bidirectional links between simulations and their corresponding strategy proposals.

5. **Agent Telemetry & Kafka Cluster Topology**
   - Real-time agent fleet inspector (Ingestion, Factor Model, Strategy Generation, Numba MC Risk Engine, Execution Agent).
   - Live 11-topic Kafka cluster health view (partitioning, consumer lag, velocity, and exactly-once semantics).
   - Immutable audit trail linking every decision to human PM tokens.

6. **Persistence & Client Demo State**
   - All approvals, rejections, simulated executions, and audit records persist across page reloads via `localStorage`.
   - Built-in "Reset State" button in the header to return to default case-study baseline at any time.

---

## Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (dark institutional fintech theme)
- **Charts**: Recharts (performance areas, sector donuts, factor bars, Monte Carlo percentile line fans)
- **Icons**: Lucide React
- **State Management**: React Context + localStorage persistence

---

## Installation & Running the Prototype

### Prerequisites
- Node.js (v18+)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build Production Bundle
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## Verification & Tests

- **TypeScript Compilation**: `npx tsc --noEmit` exits with 0 errors.
- **Production Build**: `npm run build` bundles HTML, CSS, and JS successfully into `./dist`.
- **Domain Verification**: Includes mock data for 2 distinct institutional mandates, 4 strategy archetypes, precomputed Monte Carlo paths, and audit chains.

---

*Note: All market data, trade executions, and simulation metrics are illustrative mock representations created for demonstration purposes.*
