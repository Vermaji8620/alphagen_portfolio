import React from 'react';
import {
  X,
  Cpu,
  Layers,
  Database,
  Radio,
  Clock,
  CheckCircle2,
  AlertCircle,
  Network
} from 'lucide-react';
import { useAlphaGen } from '../context/AlphaGenContext';

interface AgentTelemetryModalProps {
  onClose: () => void;
}

export const AgentTelemetryModal: React.FC<AgentTelemetryModalProps> = ({ onClose }) => {
  const { auditLogs } = useAlphaGen();

  const agents = [
    {
      name: 'Bloomberg DL & Refinitiv Eikon Ingestion Agent',
      tier: 'Ingestion Layer',
      status: 'Active (Automatic Failover Enabled)',
      throughput: '50,000 evt/s',
      latency: '18 ms',
      uptime: '99.97%',
      description: 'Persistent WebSocket heartbeat with automatic token rotation and freshness watchdog.'
    },
    {
      name: 'Multi-Factor Exposure Regression Agent',
      tier: 'Factor Model Tier',
      status: 'Active (60d Rolling Newey-West)',
      throughput: '26,600 loadings/min',
      latency: '42 ms',
      uptime: '99.99%',
      description: 'Publishes factor loadings every 15s across 400 instruments; flags loadings > 2 SD.'
    },
    {
      name: 'Strategy Generation Fleet (Momentum / Vol / Carry / Mean Reversion)',
      tier: 'Autonomous Strategy Tier',
      status: 'Active (HMM Regime Adaptive)',
      throughput: '1,450 candidate trades/hr',
      latency: '800 ms',
      uptime: '99.95%',
      description: 'Bayesian consensus layer weighting agents by regime classification and hit rate.'
    },
    {
      name: 'Numba Monte Carlo Risk Assessment Agent',
      tier: 'Pre-Trade Validation',
      status: 'Active (C-Speed JIT Compiled)',
      throughput: '10,000 paths in 118ms',
      latency: '118 ms',
      uptime: '99.98%',
      description: 'Batched Heston stochastic volatility & jump-diffusion VaR/CVaR validation.'
    },
    {
      name: 'Execution & Almgren-Chriss Slicing Agent',
      tier: 'Order Packaging',
      status: 'Ready (Awaiting PM Authorization Token)',
      throughput: 'Simulated Brokerage Queue',
      latency: '24 ms',
      uptime: '100%',
      description: 'Translates approved proposals into sliced TWAP/VWAP orders with immutable cryptographic audit trail.'
    }
  ];

  const kafkaTopics = [
    { topic: 'market.events', partitions: 32, consumerLag: '0 ms', rate: '50,000/s' },
    { topic: 'factor.signals', partitions: 32, consumerLag: '4 ms', rate: '12,500/s' },
    { topic: 'strategy.proposals', partitions: 16, consumerLag: '0 ms', rate: '450/min' },
    { topic: 'risk.decisions', partitions: 16, consumerLag: '0 ms', rate: '450/min' },
    { topic: 'execution.orders', partitions: 16, consumerLag: '0 ms', rate: '25/min' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-8">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-950/80 border border-cyan-800/60 rounded-lg text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-100">AlphaGen Agent Orchestration & Kafka Topology</h2>
                <span className="bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.2 rounded text-[10px] font-mono">SIMULATED ARCHITECTURE</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Illustrative architectural model based on the case study event topology (Simulated Telemetry)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Active Agents Fleet */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Autonomous Agent Fleet Topology
            </h3>
            <div className="space-y-3">
              {agents.map((ag, idx) => (
                <div key={idx} className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl text-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="font-bold text-slate-200">{ag.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                        {ag.tier}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">{ag.status}</span>
                  </div>

                  <p className="text-slate-400 text-[11px] font-sans">{ag.description}</p>

                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-900 font-mono text-[11px] text-slate-400">
                    <span>Throughput: <strong className="text-slate-200">{ag.throughput}</strong></span>
                    <span>p99 Latency: <strong className="text-cyan-400">{ag.latency}</strong></span>
                    <span>Uptime: <strong className="text-slate-200">{ag.uptime}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kafka Topics Bus Stats */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Kafka Bus Topics & Exactly-Once Offset Tracking
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Logical Topic</th>
                    <th className="py-2.5 px-3 text-right">Partitions</th>
                    <th className="py-2.5 px-3 text-right">Consumer Lag</th>
                    <th className="py-2.5 px-3 text-right">Message Velocity</th>
                    <th className="py-2.5 px-3">Semantics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                  {kafkaTopics.map((kt, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-bold text-cyan-400">{kt.topic}</td>
                      <td className="py-2.5 px-3 text-right text-slate-300">{kt.partitions}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{kt.consumerLag}</td>
                      <td className="py-2.5 px-3 text-right text-slate-200">{kt.rate}</td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">Idempotent upsert, per-symbol ordering</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-time Audit Chain */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Audit Activity History & Immutable Chain
            </h3>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs font-mono flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-200">{log.summary}</span>
                      <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800/40">
                        {log.actor}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-sans">{log.details}</div>
                  </div>
                  <div className="text-[10px] text-slate-500 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-1.5 px-4 rounded-lg text-xs transition-colors"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
