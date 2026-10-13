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
- **Backend API**: Node.js + Express + TypeScript (`src/server/index.ts`)
- **Database**: MongoDB Atlas (official `mongodb` driver with idempotent seeding)
- **State Management**: React Context synced with REST API

---

## MongoDB Atlas Configuration

1. Log into [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create or select your cluster, navigate to **Database Access**, and ensure a database user exists.
3. In **Network Access**, ensure your current IP address (or `0.0.0.0/0` for development) is allowlisted.
4. Click **Connect** → **Drivers** (Node.js) and copy the connection string.
5. In the project root, open `.env` (or copy from `.env.example`) and fill in your connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
   DB_NAME=alphagen_db
   FRONTEND_ORIGIN=http://localhost:5173
   ```
6. When the backend starts with `MONGODB_URI` configured, it automatically connects to your Atlas cluster and idempotently seeds initial collections (`portfolios`, `proposals`, `simulations`, `factorExposures`, `sectorExposures`, `auditLogs`) without creating duplicates.
7. If `MONGODB_URI` is not provided, the API starts gracefully in standby mock mode.

---

## Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Both Backend API and Frontend Dev Server Together
```bash
npm run dev:all
```
- Express Backend runs on `http://localhost:5000`
- Vite Frontend runs on `http://localhost:5173` (proxies `/api` to port 5000)

*(Alternatively, run in separate terminals: `npm run server` for the backend, `npm run dev` for the frontend)*

### 3. Build Production Bundle
```bash
npm run build
```

---

## Verification & Tests

- **TypeScript Compilation**: `npx tsc --noEmit` exits with 0 errors.
- **Production Build**: `npm run build` bundles HTML, CSS, and JS successfully into `./dist`.
- **Domain Verification**: Includes mock data for 2 distinct institutional mandates, 4 strategy archetypes, precomputed Monte Carlo paths, and audit chains.

---

*Note: All market data, trade executions, and simulation metrics are illustrative mock representations created for demonstration purposes.*
