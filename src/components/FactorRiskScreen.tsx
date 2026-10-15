import React from 'react';
import {
  ShieldAlert,
  Info,
  CheckCircle2,
  AlertTriangle
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
  const { selectedPortfolio, factorExposures } = useAlphaGen();

  const factors = factorExposures[selectedPortfolio.id] || [];

  return (
    <div className="space-y-3">
      {/* 1. Header & Risk Model Headline Strip */}
      <div className="bg-institutional-panel border border-institutional-border rounded p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-700" />
            <span>MSCI Barra Multi-Factor Exposure & Risk Model</span>
          </div>
          <h2 className="text-base font-semibold text-slate-900 mt-0.5">
            Factor Risks & Stress Scenario Matrix ({selectedPortfolio.code})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-sans">
            Rolling 60-day Newey-West standard error corrected regression loadings with ±2.0 SD drift watchdog.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded font-mono text-xs tabular-nums shrink-0">
          <div>
            <span className="text-xs text-slate-500 uppercase block">Active Factor Risk</span>
            <strong className="text-slate-900 text-base">{selectedPortfolio.riskMetrics.activeFactorRisk}%</strong>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-xs text-slate-500 uppercase block">Target Vol</span>
            <strong className="text-slate-700 text-base">{selectedPortfolio.targetVolatility}%</strong>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <span className="text-xs text-slate-500 uppercase block">Annualized Vol</span>
            <strong className="text-slate-700 text-base">{selectedPortfolio.riskMetrics.volatilityAnnualized}%</strong>
          </div>
        </div>
      </div>

      {/* 2. VaR, CVaR & Tail Risk Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* VaR 95% */}
        <div className="bg-institutional-panel border border-institutional-border rounded p-3 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <span>Value at Risk (95%)</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <span className="font-mono text-xs">1-DAY</span>
          </div>
          <div className="text-xl font-bold text-rose-700 font-mono tabular-nums mt-1">
            {selectedPortfolio.riskMetrics.var95}%
          </div>
          <div className="text-xs text-slate-500 font-mono mt-1">
            Est. Max Loss: ~${((Math.abs(selectedPortfolio.riskMetrics.var95) / 100) * selectedPortfolio.aum / 1e6).toFixed(1)}M
          </div>
        </div>

        {/* VaR 99% */}
        <div className="bg-institutional-panel border border-institutional-border rounded p-3 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <span>Value at Risk (99%)</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <span className="font-mono text-xs">MANDATE CAP</span>
          </div>
          <div className="text-xl font-bold text-rose-800 font-mono tabular-nums mt-1">
            {selectedPortfolio.riskMetrics.var99}%
          </div>
          <div className="text-xs text-emerald-700 font-mono mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Compliant with -2.50% cap</span>
          </div>
        </div>

        {/* CVaR 95% */}
        <div className="bg-institutional-panel border border-institutional-border rounded p-3 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <span>Conditional VaR (95%)</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <span className="font-mono text-xs">EXPECTED SHORTFALL</span>
          </div>
          <div className="text-xl font-bold text-amber-800 font-mono tabular-nums mt-1">
            {selectedPortfolio.riskMetrics.cvar95}%
          </div>
          <div className="text-xs text-slate-500 font-mono mt-1">
            Tail Beta to SPX: {selectedPortfolio.riskMetrics.betaToSP500}
          </div>
        </div>

        {/* Sharpe & Sortino */}
        <div className="bg-institutional-panel border border-institutional-border rounded p-3 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Risk-Adjusted Return</span>
            <span className="font-mono text-xs">ANNUALIZED</span>
          </div>
          <div className="flex items-baseline space-x-4 mt-1 font-mono tabular-nums">
            <div>
              <span className="text-xs text-slate-500 block font-sans">Sharpe</span>
              <strong className="text-base font-bold text-slate-900">{selectedPortfolio.riskMetrics.sharpeRatio}</strong>
            </div>
            <div className="border-l border-slate-200 pl-3">
              <span className="text-xs text-slate-500 block font-sans">Sortino</span>
              <strong className="text-base font-bold text-emerald-700">{selectedPortfolio.riskMetrics.sortinoRatio}</strong>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-mono mt-1">
            Hist Max DD: <strong className="text-slate-700">{selectedPortfolio.riskMetrics.maxDrawdownHistorical}%</strong>
          </div>
        </div>
      </div>

      {/* 3. Exposure Analysis: Active Factor Loadings Bar Chart & Table */}
      <div className="bg-institutional-panel border border-institutional-border rounded overflow-hidden shadow-xs">
        <div className="px-3.5 py-2.5 border-b border-institutional-border flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Active Multi-Factor Loadings (Active Tilt vs Benchmark)</h3>
            <p className="text-xs text-slate-500">Regression Z-Scores and drift detection watchdog flags (&gt;2.0 SD)</p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="w-2 h-0.5 bg-rose-600"></span>
            <span className="text-slate-600 text-xs">Drift Threshold (±2.0 SD)</span>
          </div>
        </div>

        <div className="p-3">
          {/* Factor Bar Chart */}
          <div className="h-56 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={factors} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="factor" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <ReferenceLine y={0} stroke="#94a3b8" />
                <ReferenceLine y={2} stroke="#dc2626" strokeDasharray="3 3" label={{ value: '+2.0 SD', fill: '#dc2626', fontSize: 11 }} />
                <ReferenceLine y={-2} stroke="#dc2626" strokeDasharray="3 3" label={{ value: '-2.0 SD', fill: '#dc2626', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    color: '#0f172a',
                    borderRadius: '3px',
                    fontSize: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                  formatter={(val: any) => [`${val}`, 'Loading']}
                />
                <Bar dataKey="loading" radius={[2, 2, 0, 0]}>
                  {factors.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.driftAlert ? '#dc2626' : entry.loading >= 0 ? '#1e40af' : '#64748b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Factor Detail Table */}
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="w-full text-left text-xs font-mono tabular-nums">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase text-xs tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Factor Model Name</th>
                  <th className="py-2.5 px-3 text-right">Portfolio Loading</th>
                  <th className="py-2.5 px-3 text-right">Benchmark Loading</th>
                  <th className="py-2.5 px-3 text-right">Active Exposure</th>
                  <th className="py-2.5 px-3 text-right">T-Statistic</th>
                  <th className="py-2.5 px-3 text-right">60-Day SD</th>
                  <th className="py-2.5 px-3">Watchdog Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {factors.map((f, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 font-sans">
                      <div className="font-semibold text-slate-900 text-sm">{f.factor}</div>
                      <div className="text-xs text-slate-500">{f.description}</div>
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 text-sm">{f.loading}</td>
                    <td className="py-2 px-3 text-right text-slate-600">{f.benchmarkLoading}</td>
                    <td className={`py-2 px-3 text-right font-medium ${f.activeExposure >= 0 ? 'text-slate-900' : 'text-slate-600'}`}>
                      {f.activeExposure >= 0 ? '+' : ''}{f.activeExposure.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-700">{f.tStat.toFixed(2)}</td>
                    <td className={`py-2 px-3 text-right font-semibold ${Math.abs(f.standardDeviations60d) > 2 ? 'text-rose-700' : 'text-slate-700'}`}>
                      {f.standardDeviations60d > 0 ? '+' : ''}{f.standardDeviations60d} SD
                    </td>
                    <td className="py-2 px-3 font-sans">
                      {f.driftAlert ? (
                        <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300 flex items-center space-x-1 w-max">
                          <AlertTriangle className="w-3 h-3 text-rose-700" />
                          <span>DRIFT ALERT</span>
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-xs bg-slate-100 text-slate-600 border border-slate-200">
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
      </div>

      {/* 4. Macroeconomic Crisis Stress Testing Matrix */}
      <div className="bg-institutional-panel border border-institutional-border rounded overflow-hidden shadow-xs">
        <div className="px-3.5 py-2.5 border-b border-institutional-border bg-slate-50/70">
          <h3 className="text-sm font-semibold text-slate-800">Historical Dislocation & Crisis Stress Replay</h3>
          <p className="text-xs text-slate-500">
            Parametric replay applying historical dislocation return shocks and covariance spike matrices.
          </p>
        </div>

        <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 2008 Lehman GFC */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900 text-sm">2008 Global Financial Crisis</span>
              <span className="text-xs font-mono text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-300">Severe Shock</span>
            </div>
            <div className="text-xl font-bold font-mono text-rose-700 tabular-nums">
              {selectedPortfolio.riskMetrics.stressCrisis2008Drawdown}%
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Liquidity freeze scenario with cross-asset correlation spike and equity decline of -38%.
            </p>
          </div>

          {/* 2020 COVID Flash Crash */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900 text-sm">2020 COVID-19 Liquidity Shock</span>
              <span className="text-xs font-mono text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">High Volatility</span>
            </div>
            <div className="text-xl font-bold font-mono text-amber-700 tabular-nums">
              {selectedPortfolio.riskMetrics.stressCovid2020Drawdown}%
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Rapid volatility jump to VIX 82 with sharp rotation between high-beta cyclicals and defensive quality.
            </p>
          </div>

          {/* 2022 Fed Rate Hike Cycle */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900 text-sm">2022 Rate Hike Cycle</span>
              <span className="text-xs font-mono text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded border border-slate-300">Duration Shock</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-800 tabular-nums">
              {selectedPortfolio.riskMetrics.stressRateHike2022Drawdown}%
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Persistent inflation shock with simultaneous equity multiple compression and bond yield spikes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
