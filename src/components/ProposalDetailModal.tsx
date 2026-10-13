import React, { useState } from 'react';
import {
  StrategyProposal,
  ProposalStatus
} from '../types/alphagen';
import {
  X,
  CheckCircle2,
  XCircle,
  PlayCircle,
  ShieldCheck,
  AlertTriangle,
  Send,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  Key
} from 'lucide-react';
import { useAlphaGen } from '../context/AlphaGenContext';

interface ProposalDetailModalProps {
  proposal: StrategyProposal;
  onClose: () => void;
  onOpenSimulation: (simId: string) => void;
}

export const ProposalDetailModal: React.FC<ProposalDetailModalProps> = ({
  proposal,
  onClose,
  onOpenSimulation
}) => {
  const { approveProposal, rejectProposal, simulateExecuteProposal, getSimulationById } = useAlphaGen();
  const [reviewNotes, setReviewNotes] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const simulation = getSimulationById(proposal.simulationId);

  const handleApprove = () => {
    approveProposal(proposal.id, reviewNotes || undefined);
    setFeedback('Proposal approved successfully by Portfolio Manager');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleReject = () => {
    rejectProposal(proposal.id, reviewNotes || undefined);
    setFeedback('Proposal rejected and marked with PM veto');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleSimulateExecute = () => {
    simulateExecuteProposal(proposal.id);
    setFeedback('Simulated order sliced and dispatched to mock Almgren-Chriss queue');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-8">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-cyan-400 font-bold text-xs tracking-wider uppercase bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
                {proposal.code}
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {proposal.category.replace('_', ' ')}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                proposal.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                proposal.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                proposal.status === 'simulated_executed' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {proposal.status.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Portfolio: <strong className="text-slate-200">{proposal.portfolioCode}</strong>
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100">{proposal.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {feedback && (
            <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Trigger & Thesis */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-500 tracking-wider">Trigger Market Event (Kafka Bus):</span>
              <p className="text-xs text-slate-300 font-mono mt-0.5">{proposal.triggerEvent}</p>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-500 tracking-wider">Investment Thesis:</span>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-sans">{proposal.thesis}</p>
            </div>
          </div>

          {/* Rationale Bullet Points */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
              Autonomous Agent Quantitative Rationale
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {proposal.rationale.map((r, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-cyan-400 font-mono">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supporting Factor Signals */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
              Multi-Factor Signals & Statistical Z-Scores
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {proposal.supportingFactorSignals.map((sig, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg font-mono text-xs">
                  <div className="text-slate-400 text-[11px]">{sig.factor}</div>
                  <div className="text-slate-100 font-bold mt-1">{sig.observedValue}</div>
                  <div className="flex justify-between items-center mt-2 text-[10px]">
                    <span className="text-slate-500">Z: {sig.zScore.toFixed(2)}</span>
                    <span className={`px-1.5 py-0.2 rounded font-semibold ${
                      sig.signalStrength.includes('Strong') ? 'text-emerald-400 bg-emerald-950/60' :
                      sig.signalStrength.includes('Positive') ? 'text-cyan-400 bg-cyan-950/60' :
                      sig.signalStrength.includes('Negative') ? 'text-rose-400 bg-rose-950/60' :
                      'text-slate-400 bg-slate-800'
                    }`}>
                      {sig.signalStrength}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proposed Orders Table */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
              Execution Orders & Almgren-Chriss Slicing
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Symbol</th>
                    <th className="py-2.5 px-3 text-right">Shares</th>
                    <th className="py-2.5 px-3 text-right">Est. Price</th>
                    <th className="py-2.5 px-3 text-right">Notional</th>
                    <th className="py-2.5 px-3 text-right">Weight Δ</th>
                    <th className="py-2.5 px-3 text-right">ADV %</th>
                    <th className="py-2.5 px-3">Execution Style</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                  {proposal.trades.map((trade, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/50">
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${trade.action === 'BUY' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                          {trade.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-100">{trade.symbol}</td>
                      <td className="py-2.5 px-3 text-right text-slate-300">{trade.shares.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-slate-300">${trade.estimatedPrice.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right text-slate-100 font-semibold">${trade.notionalValue.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-cyan-400">{trade.targetWeightDelta >= 0 ? '+' : ''}{trade.targetWeightDelta}%</td>
                      <td className={`py-2.5 px-3 text-right font-medium ${trade.advPercentage > 5.0 ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                        {trade.advPercentage.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">{trade.executionStyle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pre-Trade Risk Checks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Autonomous Risk Assessment & Mandate Limits
              </h4>
              <button
                onClick={() => {
                  onClose();
                  onOpenSimulation(proposal.simulationId);
                }}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Open Linked Simulation ({proposal.simulationId})</span>
              </button>
            </div>
            <div className="space-y-2">
              {proposal.riskChecks.map((check, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex items-start space-x-3 text-xs ${
                    check.passed
                      ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                      : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                  }`}
                >
                  {check.passed ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold font-mono">{check.name}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        check.passed ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/80'
                      }`}>
                        {check.passed ? 'PASSED' : 'VIOLATION / VETO'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{check.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision metadata if already decided */}
          {proposal.decisionMetadata && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs font-mono space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400 font-semibold">
                <Key className="w-4 h-4" />
                <span>Audited Decision Record</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <div>Decided By: <strong className="text-slate-100">{proposal.decisionMetadata.decidedBy}</strong></div>
                <div>Timestamp: <strong className="text-slate-100">{new Date(proposal.decisionMetadata.decidedAt).toLocaleString()}</strong></div>
              </div>
              {proposal.decisionMetadata.notes && (
                <div className="text-slate-400 pt-1 border-t border-slate-850">
                  PM Rationale: <span className="text-slate-200">{proposal.decisionMetadata.notes}</span>
                </div>
              )}
            </div>
          )}

          {/* Decision Workflow Input for Pending */}
          {proposal.status === 'pending' && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="block text-xs font-mono text-slate-400 font-medium">
                Portfolio Manager Authorization Notes (Optional Audit Annotation):
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter PM rationale for audit compliance logs..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4 sticky bottom-0">
          <div className="text-xs font-mono text-slate-400 flex items-center space-x-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Segregation of duties: Human PM token required to authorize execution.</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 px-4 rounded-lg text-xs transition-colors"
            >
              Close
            </button>

            {proposal.status === 'pending' && (
              <>
                <button
                  onClick={handleReject}
                  className="bg-rose-900/40 hover:bg-rose-800/60 text-rose-300 border border-rose-700/60 font-medium py-2 px-4 rounded-lg text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Proposal</span>
                </button>
                <button
                  onClick={handleApprove}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-2 px-5 rounded-lg text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-950/40 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize & Approve</span>
                </button>
              </>
            )}

            {proposal.status === 'approved' && (
              <button
                onClick={handleSimulateExecute}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-5 rounded-lg text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-950/40 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Simulate Order Routing</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
