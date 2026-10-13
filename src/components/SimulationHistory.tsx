import React, { useState } from 'react';
import {
  PlayCircle,
  Clock,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import { useAlphaGen } from '../context/AlphaGenContext';
import { SimulationResult } from '../types/alphagen';

interface SimulationHistoryProps {
  initialSelectedId?: string | null;
  onSelectProposalFromSim: (proposalId: string) => void;
}

export const SimulationHistory: React.FC<SimulationHistoryProps> = ({
  initialSelectedId,
  onSelectProposalFromSim
}) => {
  const { simulations, getProposalById } = useAlphaGen();
  const [selectedSimId, setSelectedSimId] = useState<string>(
    initialSelectedId && simulations.some(s => s.id === initialSelectedId)
      ? initialSelectedId
      : simulations[0]?.id || ''
  );

  const activeSim = simulations.find(s => s.id === selectedSimId) || simulations[0];
  const linkedProposal = activeSim ? getProposalById(activeSim.strategyId) : undefined;

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase mb-1">
              <Cpu className="w-4 h-4" />
              <span>Numba-Accelerated Monte Carlo Engine (C-Speed JIT)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Simulation Runs & Correlated Path Distributions
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Generates 10,000 correlated price paths across 400 instruments in sub-120 milliseconds.
              Models stochastic volatility (Heston), jump-diffusion tail components, and PCA covariance structures.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-300">
              Mean Runtime: <strong className="text-cyan-400">116 ms</strong>
            </span>
            <span className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-300">
              Paths: <strong className="text-emerald-400">10,000</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Historical Simulation Runs Table */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3 font-sans">Historical Simulation Runs</h3>
            <div className="space-y-2.5">
              {simulations.map(sim => {
                const isSelected = sim.id === selectedSimId;
                const passed = sim.riskCheckOutcome.passed;

                return (
                  <div
                    key={sim.id}
                    onClick={() => setSelectedSimId(sim.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer font-mono text-xs ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-cyan-400">{sim.id}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        passed ? 'text-emerald-400 bg-emerald-950 border border-emerald-800' : 'text-rose-400 bg-rose-950 border border-rose-800'
                      }`}>
                        {passed ? 'VALIDATED' : 'RISK VETO'}
                      </span>
                    </div>

                    <div className="text-slate-200 font-sans font-medium line-clamp-1 mb-1">
                      {sim.strategyName}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{sim.computeDurationMs} ms (10k paths)</span>
                      <span>{new Date(sim.runTimestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 font-mono">
            Lineage Model: All simulation parameters indexed with immutable random seed in PostgreSQL.
          </div>
        </div>

        {/* Right Column: Selected Simulation Deep-Dive */}
        {activeSim && (
          <div className="lg:col-span-2 space-y-6">
            {/* Simulation Metadata Card */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 uppercase bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded">
                      {activeSim.id}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Execution: {activeSim.computeDurationMs}ms</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-1">{activeSim.strategyName}</h3>
                </div>

                {linkedProposal && (
                  <button
                    onClick={() => onSelectProposalFromSim(linkedProposal.id)}
                    className="flex items-center space-x-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors"
                  >
                    <span>View Linked Proposal ({linkedProposal.code})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Distribution Percentiles Chart */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                      Monte Carlo 30-Day Return Fan Chart (Percentile Bands)
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">10,000 paths across 30 daily discrete time-steps (%)</p>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] font-mono">
                    <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 bg-cyan-400 rounded-sm"></span><span className="text-slate-300">Median</span></span>
                    <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 bg-emerald-400 rounded-sm"></span><span className="text-slate-400">p75-p95</span></span>
                    <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 bg-rose-400 rounded-sm"></span><span className="text-slate-400">p5 (Tail VaR)</span></span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeSim.distributionPaths} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="timeStep" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} unit="d" />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} unit="%" />
                      <ReferenceLine y={0} stroke="#475569" strokeDasharray="2 2" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                        formatter={(val: any) => [`${val}%`, 'Return']}
                      />
                      <Line type="monotone" dataKey="p95" stroke="#10b981" strokeWidth={1.5} dot={false} strokeDasharray="3 3" name="95th Percentile" />
                      <Line type="monotone" dataKey="p75" stroke="#34d399" strokeWidth={1.5} dot={false} name="75th Percentile" />
                      <Line type="monotone" dataKey="median" stroke="#06b6d4" strokeWidth={2.5} dot={false} name="Median Path" />
                      <Line type="monotone" dataKey="p25" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="25th Percentile" />
                      <Line type="monotone" dataKey="p5" stroke="#f43f5e" strokeWidth={2} dot={false} name="5th Percentile (Tail)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Statistical Metrics Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 font-mono text-xs">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Expected 30d Alpha:</span>
                  <div className="text-base font-bold text-emerald-400 mt-1">+{activeSim.metrics.expectedReturn30d}%</div>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Hit Rate Probability:</span>
                  <div className="text-base font-bold text-cyan-400 mt-1">{activeSim.metrics.hitRateProbability}%</div>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px]">99% Tail VaR:</span>
                  <div className="text-base font-bold text-rose-400 mt-1">{activeSim.metrics.var99}%</div>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Max DD Prob (95%):</span>
                  <div className="text-base font-bold text-slate-200 mt-1">{activeSim.metrics.maxDrawdownProb95}%</div>
                </div>
              </div>

              {/* Model Assumptions & Risk Outcome */}
              <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-3">
                <div className="text-slate-300 font-semibold flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Calibrated Kernel Assumptions</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-400 text-[11px]">
                  <div>Volatility Model: <span className="text-slate-200">{activeSim.assumptions.volatilityModel}</span></div>
                  <div>Jump Diffusion: <span className="text-slate-200">{activeSim.assumptions.jumpDiffusion ? 'Enabled (Merton Jumps)' : 'Disabled'}</span></div>
                  <div>Covariance Matrix: <span className="text-slate-200">{activeSim.assumptions.covarianceEstimation}</span></div>
                  <div>Execution Horizon: <span className="text-slate-200">{activeSim.assumptions.almgrenChrissHorizonMin} mins Almgren-Chriss</span></div>
                </div>

                <div className="pt-2 border-t border-slate-850 flex items-start space-x-2">
                  {activeSim.riskCheckOutcome.passed ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold text-slate-200">
                      Risk Engine Verdict: {activeSim.riskCheckOutcome.passed ? 'PASSED MANDATE LIMITS' : 'REJECTED / AUTOMATIC VETO'}
                    </span>
                    {activeSim.riskCheckOutcome.vetoReason && (
                      <p className="text-rose-400 mt-0.5 text-[11px] font-sans">{activeSim.riskCheckOutcome.vetoReason}</p>
                    )}
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
