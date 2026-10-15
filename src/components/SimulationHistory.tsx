import React, { useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sliders,
  CheckCircle2,
  XCircle,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { useAlphaGen } from '../context/AlphaGenContext';
import { useTheme } from '../context/ThemeContext';

interface SimulationHistoryProps {
  initialSelectedId?: string | null;
  onSelectProposalFromSim: (proposalId: string) => void;
}

export const SimulationHistory: React.FC<SimulationHistoryProps> = ({
  initialSelectedId,
  onSelectProposalFromSim
}) => {
  const { isLight } = useTheme();
  const { simulations, getProposalById } = useAlphaGen();
  const [selectedSimId, setSelectedSimId] = useState<string>(
    initialSelectedId && simulations.some(s => s.id === initialSelectedId)
      ? initialSelectedId
      : simulations[0]?.id || ''
  );

  const activeSim = simulations.find(s => s.id === selectedSimId) || simulations[0];
  const linkedProposal = activeSim ? getProposalById(activeSim.strategyId) : undefined;

  return (
    <div className="space-y-3">
      {/* Simulation Workstation Strip */}
      <div className="bg-institutional-panel border border-institutional-border rounded p-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 font-mono text-xs uppercase tracking-wider mb-0.5">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>Stochastic Engine // Monte Carlo Simulation Lineage</span>
            </div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              Parametric Simulation Registry & Correlated Path Distributions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 max-w-3xl leading-normal">
              10,000 correlated price paths across 400 instruments modeling Heston stochastic volatility, jump-diffusion tail components, and PCA covariance shrinkage.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono tabular-nums shrink-0">
            <span className="bg-slate-50 border border-institutional-border px-2.5 py-1 rounded text-slate-600">
              Mean JIT Runtime: <strong className="text-slate-900 font-semibold">116 ms</strong>
            </span>
            <span className="bg-slate-50 border border-institutional-border px-2.5 py-1 rounded text-slate-600">
              Discrete Paths: <strong className="text-emerald-700 font-semibold">10,000</strong>
            </span>
            <span className="bg-slate-50 border border-institutional-border px-2.5 py-1 rounded text-slate-600">
              Instruments: <strong className="text-slate-900 font-semibold">400</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: Registry on Left, Inputs + Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left: Simulation Registry (col-span-4) */}
        <div className="lg:col-span-4 bg-institutional-panel border border-institutional-border rounded flex flex-col justify-between">
          <div>
            <div className="px-3.5 py-2.5 border-b border-institutional-border bg-slate-50/70 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
                Simulation Registry ({simulations.length})
              </span>
              <span className="text-xs text-slate-400 font-mono">Numba v0.58</span>
            </div>

            <div className="p-2 space-y-1.5 overflow-y-auto max-h-[660px]">
              {simulations.map(sim => {
                const isSelected = sim.id === (activeSim?.id || selectedSimId);
                const passed = sim.riskCheckOutcome.passed;

                return (
                  <div
                    key={sim.id}
                    onClick={() => setSelectedSimId(sim.id)}
                    className={`p-2.5 rounded border transition-colors cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-blue-50/60 border-blue-500 shadow-xs'
                        : 'bg-white border-institutional-border hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 font-mono">
                      <span className={`font-semibold text-sm ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                        {sim.id}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs font-medium border ${
                          passed
                            ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                            : 'text-rose-800 bg-rose-50 border-rose-200'
                        }`}
                      >
                        {passed ? 'VALIDATED' : 'RISK VETO'}
                      </span>
                    </div>

                    <div className="text-slate-800 font-sans font-medium line-clamp-1 mb-1 text-xs">
                      {sim.strategyName}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 font-mono tabular-nums">
                      <span>Compute: {sim.computeDurationMs} ms</span>
                      <span>
                        {new Date(sim.runTimestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-2.5 border-t border-institutional-border bg-slate-50/60 text-xs text-slate-500 font-sans">
            Lineage Model: All simulation parameters indexed with immutable seed integers for deterministic reproduction.
          </div>
        </div>

        {/* Right: Inputs & Results Reviewed Together (col-span-8) */}
        {activeSim && (
          <div className="lg:col-span-8 space-y-3">
            {/* Run Detail Header Strip */}
            <div className="bg-institutional-panel border border-institutional-border rounded p-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-institutional-border">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-semibold text-slate-800 uppercase bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
                      {activeSim.id}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Compute Duration: <strong className="text-slate-800 font-semibold">{activeSim.computeDurationMs} ms</strong>
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Status: <strong className={activeSim.riskCheckOutcome.passed ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>{activeSim.status}</strong>
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mt-1">{activeSim.strategyName}</h3>
                </div>

                {linkedProposal && (
                  <button
                    onClick={() => onSelectProposalFromSim(linkedProposal.id)}
                    className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 border border-institutional-border text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded text-xs font-sans transition-colors cursor-pointer shrink-0 shadow-xs"
                  >
                    <span>View Linked Proposal ({linkedProposal.code})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
              </div>

              {/* Side-by-Side Review: Parametric Inputs & Pre-Trade Risk Clearance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {/* Inputs & Assumptions Panel */}
                <div className="bg-slate-50/70 border border-institutional-border rounded p-3 text-xs space-y-2">
                  <div className="text-slate-800 font-semibold flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span>Calibrated Kernel Assumptions</span>
                  </div>
                  <div className="divide-y divide-institutional-border text-xs font-mono tabular-nums">
                    <div className="py-1 flex justify-between">
                      <span className="text-slate-500">Volatility Model:</span>
                      <span className="text-slate-800 font-medium">{activeSim.assumptions.volatilityModel}</span>
                    </div>
                    <div className="py-1 flex justify-between">
                      <span className="text-slate-500">Jump Diffusion:</span>
                      <span className="text-slate-800 font-medium">
                        {activeSim.assumptions.jumpDiffusion ? 'Enabled (Merton Jumps)' : 'Disabled'}
                      </span>
                    </div>
                    <div className="py-1 flex justify-between">
                      <span className="text-slate-500">Covariance Matrix:</span>
                      <span className="text-slate-800 font-medium">{activeSim.assumptions.covarianceEstimation}</span>
                    </div>
                    <div className="py-1 flex justify-between">
                      <span className="text-slate-500">Execution Horizon:</span>
                      <span className="text-slate-800 font-medium">
                        {activeSim.assumptions.almgrenChrissHorizonMin}m Almgren-Chriss
                      </span>
                    </div>
                    <div className="py-1 flex justify-between">
                      <span className="text-slate-500">Time Horizon & Confidence:</span>
                      <span className="text-slate-800 font-medium">
                        {activeSim.assumptions.timeHorizonDays}d @ {activeSim.assumptions.confidenceInterval}% CI
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pre-Trade Risk Mandate Clearance Panel */}
                <div className="bg-slate-50/70 border border-institutional-border rounded p-3 text-xs space-y-2">
                  <div className="text-slate-800 font-semibold flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pre-Trade Risk Clearance</span>
                  </div>
                  <div className="divide-y divide-institutional-border text-xs font-mono tabular-nums">
                    <div className="py-1 flex items-center justify-between">
                      <span className="text-slate-500">VaR Limit Check:</span>
                      <span className="flex items-center space-x-1 text-slate-800 font-medium">
                        {activeSim.riskCheckOutcome.varCheckPassed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">PASSED</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span className="text-rose-700">FAILED</span>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="py-1 flex items-center justify-between">
                      <span className="text-slate-500">Concentration Limit Check:</span>
                      <span className="flex items-center space-x-1 text-slate-800 font-medium">
                        {activeSim.riskCheckOutcome.concentrationLimitPassed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">PASSED</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span className="text-rose-700">FAILED</span>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="py-1 flex items-center justify-between">
                      <span className="text-slate-500">Liquidity Floor (&lt;5% ADV):</span>
                      <span className="flex items-center space-x-1 text-slate-800 font-medium">
                        {activeSim.riskCheckOutcome.liquidityFloorPassed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">PASSED</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span className="text-rose-700">FAILED</span>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="pt-2 flex items-start space-x-2">
                      {activeSim.riskCheckOutcome.passed ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold text-slate-900 text-sm font-sans">
                          {activeSim.riskCheckOutcome.passed
                            ? 'Verdict: PASSED MANDATE LIMITS'
                            : 'Verdict: REJECTED / AUTOMATIC VETO'}
                        </div>
                        {activeSim.riskCheckOutcome.vetoReason && (
                          <p className="text-rose-600 mt-0.5 text-xs font-sans">
                            {activeSim.riskCheckOutcome.vetoReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results: Distribution Fan Chart & Key Statistical Metrics */}
            <div className="bg-institutional-panel border border-institutional-border rounded p-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-institutional-border">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-800 font-mono">
                    Monte Carlo 30-Day Correlated Return Fan Chart
                  </h4>
                  <p className="text-xs text-slate-500 font-sans">
                    10,000 paths projected across 30 daily discrete time-steps (%)
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-sans">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-1 bg-blue-700 rounded-sm"></span>
                    <span className="text-slate-700 font-medium">Median</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-1 bg-emerald-600 rounded-sm"></span>
                    <span className="text-slate-500">p75-p95</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-1 bg-amber-500 rounded-sm"></span>
                    <span className="text-slate-500">p25</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-1 bg-rose-600 rounded-sm"></span>
                    <span className="text-slate-500">p5 (Tail)</span>
                  </span>
                </div>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={activeSim.distributionPaths}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="timeStep"
                      stroke="#64748b"
                      tick={{ fontSize: 11, fontFamily: 'monospace' }}
                      unit="d"
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 11, fontFamily: 'monospace' }}
                      unit="%"
                    />
                    <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="2 2" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#cbd5e1',
                        color: '#0f172a',
                        borderRadius: '4px',
                        fontSize: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                      }}
                      formatter={(val: any) => [`${val}%`, 'Return']}
                    />
                    <Line
                      type="monotone"
                      dataKey="p95"
                      stroke="#059669"
                      strokeWidth={1.5}
                      dot={false}
                      strokeDasharray="3 3"
                      name="95th Percentile"
                    />
                    <Line
                      type="monotone"
                      dataKey="p75"
                      stroke="#10b981"
                      strokeWidth={1.5}
                      dot={false}
                      name="75th Percentile"
                    />
                    <Line
                      type="monotone"
                      dataKey="median"
                      stroke="#1d4ed8"
                      strokeWidth={2}
                      dot={false}
                      name="Median Path"
                    />
                    <Line
                      type="monotone"
                      dataKey="p25"
                      stroke="#d97706"
                      strokeWidth={1.5}
                      dot={false}
                      name="25th Percentile"
                    />
                    <Line
                      type="monotone"
                      dataKey="p5"
                      stroke="#dc2626"
                      strokeWidth={2}
                      dot={false}
                      name="5th Percentile (Tail)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Statistical Metrics Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-institutional-border font-mono text-xs tabular-nums">
                <div className="bg-slate-50/80 p-2.5 rounded border border-institutional-border">
                  <span className="text-slate-500 text-xs font-sans block">Expected 30d Alpha</span>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">
                    +{activeSim.metrics.expectedReturn30d}%
                  </div>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded border border-institutional-border">
                  <span className="text-slate-500 text-xs font-sans block">Hit Rate Probability</span>
                  <div className="text-base font-bold text-slate-800 mt-0.5">
                    {activeSim.metrics.hitRateProbability}%
                  </div>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded border border-institutional-border">
                  <span className="text-slate-500 text-xs font-sans block">99% Tail VaR (Horizon)</span>
                  <div className="text-base font-bold text-rose-700 mt-0.5">
                    {activeSim.metrics.var99}%
                  </div>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded border border-institutional-border">
                  <span className="text-slate-500 text-xs font-sans block">95% CVaR / Expected Shortfall</span>
                  <div className="text-base font-bold text-rose-700 mt-0.5">
                    {activeSim.metrics.cvar95}%
                  </div>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded border border-institutional-border">
                  <span className="text-slate-500 text-xs font-sans block">95% VaR</span>
                  <div className="text-base font-bold text-slate-800 mt-0.5">
                    {activeSim.metrics.var95}%
                  </div>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded border border-institutional-border">
                  <span className="text-slate-500 text-xs font-sans block">Sharpe Range [Min / Med / Max]</span>
                  <div className="text-sm font-semibold text-slate-800 mt-1">
                    {activeSim.metrics.sharpeDistribution.min.toFixed(2)} / {activeSim.metrics.sharpeDistribution.median.toFixed(2)} / {activeSim.metrics.sharpeDistribution.max.toFixed(2)}
                  </div>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded border border-institutional-border">
                  <span className="text-slate-500 text-xs font-sans block">Max DD Probability (95%)</span>
                  <div className="text-base font-bold text-slate-800 mt-0.5">
                    {activeSim.metrics.maxDrawdownProb95}%
                  </div>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded border border-institutional-border">
                  <span className="text-slate-500 text-xs font-sans block">Est. Market Slippage</span>
                  <div className="text-base font-bold text-slate-800 mt-0.5">
                    {activeSim.metrics.estimatedSlippageBps} bps
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
