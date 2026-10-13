import React, { useState } from 'react';
import {
  ShieldAlert,
  Sliders,
  AlertTriangle,
  Info,
  CheckCircle2,
  TrendingDown,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell
} from 'recharts';
import { useAlphaGen } from '../context/AlphaGenContext';

export const FactorRiskScreen: React.FC = () => {
  const { selectedPortfolio, factorExposures, sectorExposures } = useAlphaGen();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const factors = factorExposures[selectedPortfolio.id] || [];
  const sectors = sectorExposures[selectedPortfolio.id] || [];

  return (
    <div className="space-y-6">
      {/* Risk Header & Institutional Disclosure */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Multi-Factor Exposure Modeling & Stress Testing</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Factor Risks & Stress Scenario Matrix ({selectedPortfolio.code})
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Illustrative rolling 60-day Newey-West standard error corrected factor regression loadings.
              Automated drift detection flags loadings exceeding 2.0 standard deviations from the 60-day mean (Illustrative Precomputed Model).
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-lg text-xs font-mono shrink-0">
            <span className="text-slate-400">Active Factor Risk: </span>
            <span className="text-cyan-400 font-bold">{selectedPortfolio.riskMetrics.activeFactorRisk}%</span>
            <span className="text-slate-500 ml-2">| Target Vol: {selectedPortfolio.targetVolatility}%</span>
          </div>
        </div>
      </div>

      {/* Primary Risk Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* VaR 95% */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <span>Value at Risk (95%)</span>
              <span title="Max expected 1-day loss at 95% confidence level" className="cursor-help">
                <Info className="w-3.5 h-3.5 text-slate-500" />
              </span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">1-DAY HORIZON</span>
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">
            {selectedPortfolio.riskMetrics.var95}%
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Est. Max Loss: ~${((Math.abs(selectedPortfolio.riskMetrics.var95) / 100) * selectedPortfolio.aum / 1e6).toFixed(1)}M
          </p>
        </div>

        {/* VaR 99% */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <span>Value at Risk (99%)</span>
              <span title="Max expected 1-day loss at 99% confidence level (Mandate ceiling -2.50%)" className="cursor-help">
                <Info className="w-3.5 h-3.5 text-slate-500" />
              </span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">MANDATE CAP</span>
          </div>
          <div className="text-2xl font-bold text-rose-500 font-mono">
            {selectedPortfolio.riskMetrics.var99}%
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 font-mono flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Compliant with -2.50% ceiling</span>
          </p>
        </div>

        {/* CVaR (Expected Shortfall) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <span>Conditional VaR (95%)</span>
              <span title="Expected average tail loss beyond 95th percentile" className="cursor-help">
                <Info className="w-3.5 h-3.5 text-slate-500" />
              </span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">EXPECTED SHORTFALL</span>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {selectedPortfolio.riskMetrics.cvar95}%
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Tail Risk Beta: {selectedPortfolio.riskMetrics.betaToSP500} to SPX
          </p>
        </div>

        {/* Sharpe & Sortino */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Risk-Adjusted Return</span>
            <span className="text-[10px] font-mono text-cyan-400">ANNUALIZED</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 font-mono">Sharpe: </span>
              <span className="text-2xl font-bold text-cyan-400 font-mono">{selectedPortfolio.riskMetrics.sharpeRatio}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-mono">Sortino: </span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{selectedPortfolio.riskMetrics.sortinoRatio}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Ann Vol: <strong className="text-slate-200">{selectedPortfolio.riskMetrics.volatilityAnnualized}%</strong>
          </p>
        </div>
      </div>

      {/* Factor Loading Chart & Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Active Factor Loadings (Active Tilt vs Benchmark)</h3>
            <p className="text-xs text-slate-400 font-mono">Regression Z-Scores and drift detection flags (&gt;2.0 SD)</p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-400">Drift Alert (&gt;2.0 SD)</span>
          </div>
        </div>

        {/* Factor Loading Bar Chart */}
        <div className="h-64 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={factors} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="factor" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <ReferenceLine y={0} stroke="#475569" />
              <ReferenceLine y={2} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: '+2.0 SD', fill: '#f43f5e', fontSize: 10 }} />
              <ReferenceLine y={-2} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: '-2.0 SD', fill: '#f43f5e', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                formatter={(val: any) => [`${val}`, 'Loading']}
              />
              <Bar dataKey="loading" radius={[4, 4, 0, 0]}>
                {factors.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.driftAlert ? '#f43f5e' : entry.loading >= 0 ? '#06b6d4' : '#3b82f6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Factor Detail Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Factor Model Name</th>
                <th className="py-2.5 px-3 text-right">Portfolio Loading</th>
                <th className="py-2.5 px-3 text-right">Benchmark</th>
                <th className="py-2.5 px-3 text-right">Active Exposure</th>
                <th className="py-2.5 px-3 text-right">T-Statistic</th>
                <th className="py-2.5 px-3 text-right">60-Day SD</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/60">
              {factors.map((f, idx) => (
                <tr key={idx} className="hover:bg-slate-850/50">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-200">{f.factor}</div>
                    <div className="text-[10px] text-slate-500 font-sans">{f.description}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-100">{f.loading}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{f.benchmarkLoading}</td>
                  <td className={`py-2.5 px-3 text-right font-medium ${f.activeExposure >= 0 ? 'text-cyan-400' : 'text-blue-400'}`}>
                    {f.activeExposure >= 0 ? '+' : ''}{f.activeExposure.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{f.tStat.toFixed(2)}</td>
                  <td className={`py-2.5 px-3 text-right font-semibold ${Math.abs(f.standardDeviations60d) > 2 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {f.standardDeviations60d > 0 ? '+' : ''}{f.standardDeviations60d} SD
                  </td>
                  <td className="py-2.5 px-3">
                    {f.driftAlert ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800 flex items-center space-x-1 w-max">
                        <AlertTriangle className="w-3 h-3" />
                        <span>DRIFT ALERT</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                        NORMAL
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stress Scenarios & Crisis Historical Simulations */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-1">Historical Crisis Stress Scenarios</h3>
        <p className="text-xs text-slate-400 font-mono mb-4">
          Precomputed Monte Carlo replay applying historical dislocation returns and covariance spikes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 2008 Lehman GFC */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">2008 Global Financial Crisis</span>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded">Severe Stress</span>
            </div>
            <div className="text-2xl font-bold font-mono text-rose-400">
              {selectedPortfolio.riskMetrics.stressCrisis2008Drawdown}%
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Liquidity freeze scenario with high cross-asset correlation spike and equity market decline of -38%.
            </p>
          </div>

          {/* 2020 COVID Liquidity Shock */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">2020 COVID-19 Flash Crash</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded">High Volatility</span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {selectedPortfolio.riskMetrics.stressCovid2020Drawdown}%
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Rapid volatility jump to VIX 82 with sharp rotation between high-beta cyclicals and defensive quality.
            </p>
          </div>

          {/* 2022 Fed Rate Hike Cycle */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">2022 Rapid Rate Hike Cycle</span>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded">Duration Shock</span>
            </div>
            <div className="text-2xl font-bold font-mono text-blue-400">
              {selectedPortfolio.riskMetrics.stressRateHike2022Drawdown}%
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Persistent inflation shock with simultaneous equity valuation multiple compression and bond yields spike.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
