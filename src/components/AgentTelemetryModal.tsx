import React from 'react';
import {
  X,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white border border-institutional-border rounded max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg flex flex-col my-8">
        <div className="p-4 border-b border-institutional-border flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-blue-50 border border-blue-200 rounded text-blue-700">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xs font-semibold text-slate-900 uppercase font-mono tracking-wider">
                  Agent Orchestration & Pipeline Topology
                </h2>
                <span className="bg-slate-100 text-slate-600 border border-slate-300 px-1 py-0.2 rounded text-[10px] font-mono">
                  SIMULATED ARCHITECTURE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                Real-time distributed bus telemetry and execution worker state
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Active Agents Fleet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold">
                Autonomous Agent Fleet Topology
              </h3>
              <span className="text-xs font-mono text-emerald-700 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                5 / 5 Workers Healthy
              </span>
            </div>
            <div className="space-y-2">
              {agents.map((ag, idx) => (
                <div key={idx} className="bg-slate-50 border border-institutional-border p-3 rounded text-xs space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                      <span className="font-semibold text-slate-800 text-sm">{ag.name}</span>
                      <span className="text-xs font-mono text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {ag.tier}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{ag.status}</span>
                  </div>

                  <p className="text-slate-600 text-xs leading-normal font-sans">{ag.description}</p>

                  <div className="flex flex-wrap items-center gap-4 pt-1.5 border-t border-institutional-border font-mono text-xs text-slate-600 tabular-nums">
                    <span>Throughput: <strong className="text-slate-900">{ag.throughput}</strong></span>
                    <span>p99 Latency: <strong className="text-blue-800">{ag.latency}</strong></span>
                    <span>Uptime: <strong className="text-emerald-700">{ag.uptime}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kafka Topics Bus Stats */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold mb-2">
              Kafka Bus Topics & Exactly-Once Offset Tracking
            </h3>
            <div className="overflow-x-auto rounded border border-institutional-border">
              <table className="w-full text-left text-xs font-mono tabular-nums">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs border-b border-institutional-border font-semibold">
                  <tr>
                    <th className="py-2 px-3">Logical Topic</th>
                    <th className="py-2 px-3 text-right">Partitions</th>
                    <th className="py-2 px-3 text-right">Consumer Lag</th>
                    <th className="py-2 px-3 text-right">Message Velocity</th>
                    <th className="py-2 px-3">Semantics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-institutional-border bg-white">
                  {kafkaTopics.map((kt, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 font-semibold text-slate-800">{kt.topic}</td>
                      <td className="py-2 px-3 text-right text-slate-600">{kt.partitions}</td>
                      <td className="py-2 px-3 text-right text-emerald-700 font-semibold">{kt.consumerLag}</td>
                      <td className="py-2 px-3 text-right text-slate-800">{kt.rate}</td>
                      <td className="py-2 px-3 text-slate-500 text-xs font-sans">Idempotent upsert, symbol partition key</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-time Audit Chain */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold mb-2">
              Audit Activity History & Immutable Chain
            </h3>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {auditLogs.map(log => (
                <div key={log.id} className="p-2.5 bg-slate-50 border border-institutional-border rounded text-xs font-mono flex items-start justify-between gap-2.5">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-800 text-sm">{log.summary}</span>
                      <span className="text-xs text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                        {log.actor}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 font-sans">{log.details}</div>
                  </div>
                  <div className="text-xs text-slate-500 shrink-0 tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-institutional-border bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="bg-white hover:bg-slate-100 text-slate-700 font-medium py-1.5 px-3 rounded text-xs border border-institutional-border transition-colors cursor-pointer"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
