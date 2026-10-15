import React, { useState } from 'react';
import {
  StrategyProposal
} from '../types/alphagen';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Info,
  Key
} from 'lucide-react';
import { useAlphaGen } from '../context/AlphaGenContext';
import { useAuth } from '../context/AuthContext';

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
  const { user, hasRole } = useAuth();
  const [reviewNotes, setReviewNotes] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const isPM = hasRole(['PORTFOLIO_MANAGER']);
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
    setFeedback('Proposal rejected with PM veto recorded');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleSimulateExecute = () => {
    simulateExecuteProposal(proposal.id);
    setFeedback('Simulated order sliced and dispatched to clearing queue');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white border border-institutional-border rounded max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg flex flex-col my-8">
        {/* Modal Header */}
        <div className="p-4 border-b border-institutional-border flex items-start justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-slate-800 font-bold text-xs tracking-wider uppercase bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded">
                {proposal.code}
              </span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-institutional-border">
                {proposal.category.replace('_', ' ')}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                proposal.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                proposal.status === 'rejected' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                proposal.status === 'simulated_executed' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {proposal.status.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-slate-500">
                Mandate: <strong className="text-slate-800">{proposal.portfolioCode}</strong>
              </span>
            </div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900">{proposal.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {feedback && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded text-xs flex items-center space-x-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Trigger & Thesis */}
          <div className="bg-slate-50 border border-institutional-border rounded p-3.5 space-y-2">
            <div>
              <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">Market Trigger Event:</span>
              <p className="text-xs text-slate-800 font-mono mt-0.5">{proposal.triggerEvent}</p>
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">Investment Thesis:</span>
              <p className="text-sm text-slate-800 mt-0.5 leading-relaxed font-sans">{proposal.thesis}</p>
            </div>
          </div>

          {/* Rationale Bullet Points */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
              Quantitative Model Rationale
            </h4>
            <ul className="space-y-1 text-sm text-slate-700">
              {proposal.rationale.map((r, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-blue-600 font-mono font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supporting Factor Signals */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
              Multi-Factor Signals & Z-Scores
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {proposal.supportingFactorSignals.map((sig, idx) => (
                <div key={idx} className="bg-slate-50 border border-institutional-border p-2.5 rounded font-mono text-xs tabular-nums">
                  <div className="text-slate-500 text-xs font-sans">{sig.factor}</div>
                  <div className="text-slate-900 font-bold text-sm mt-0.5">{sig.observedValue}</div>
                  <div className="flex justify-between items-center mt-1.5 text-xs">
                    <span className="text-slate-500">Z: {sig.zScore.toFixed(2)}</span>
                    <span className={`px-1.5 py-0.5 rounded font-medium ${
                      sig.signalStrength.includes('Strong') ? 'text-emerald-800 bg-emerald-50 border border-emerald-200' :
                      sig.signalStrength.includes('Positive') ? 'text-blue-800 bg-blue-50 border border-blue-200' :
                      sig.signalStrength.includes('Negative') ? 'text-rose-800 bg-rose-50 border border-rose-200' :
                      'text-slate-700 bg-slate-100'
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
              Execution Orders & Order Slicing
            </h4>
            <div className="overflow-x-auto rounded border border-institutional-border">
              <table className="w-full text-left text-xs font-mono tabular-nums">
                <thead className="bg-slate-50 border-b border-institutional-border text-slate-600 uppercase text-xs font-semibold">
                  <tr>
                    <th className="py-2 px-3">Action</th>
                    <th className="py-2 px-3">Symbol</th>
                    <th className="py-2 px-3 text-right">Shares</th>
                    <th className="py-2 px-3 text-right">Est. Price</th>
                    <th className="py-2 px-3 text-right">Notional</th>
                    <th className="py-2 px-3 text-right">Weight Δ</th>
                    <th className="py-2 px-3">Execution Schedule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-institutional-border bg-white">
                  {proposal.trades.map((trade, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3">
                        <span className={`font-bold px-1.5 py-0.5 rounded text-xs ${
                          trade.action === 'BUY' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                        }`}>
                          {trade.action}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-800 text-sm">{trade.symbol}</td>
                      <td className="py-2 px-3 text-right text-slate-700">{trade.shares.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-slate-700">${trade.estimatedPrice.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right text-slate-900 font-bold">${(trade.notionalValue / 1e6).toFixed(2)}M</td>
                      <td className={`py-2 px-3 text-right font-medium ${trade.targetWeightDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {trade.targetWeightDelta >= 0 ? '+' : ''}{trade.targetWeightDelta}%
                      </td>
                      <td className="py-2 px-3 text-slate-600 text-xs font-sans">{trade.executionStyle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pre-Trade Risk Verification */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
              Automated Pre-Trade Mandate Risk Clearance
            </h4>
            <div className="space-y-1.5">
              {proposal.riskChecks.map((check, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 p-2.5 rounded bg-slate-50 border border-institutional-border text-xs">
                  {check.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 text-sm">{check.name}</span>
                      <span className="text-xs font-mono text-slate-500 uppercase">Status: {check.severity}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{check.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision metadata if already decided */}
          {proposal.decisionMetadata && (
            <div className="bg-slate-50 border border-institutional-border rounded p-3 text-xs font-mono space-y-1.5">
              <div className="flex items-center space-x-1.5 text-slate-700 font-semibold">
                <Key className="w-3.5 h-3.5 text-slate-500" />
                <span>Audited Decision Record</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 text-xs">
                <div>Decided By: <strong className="text-slate-900">{proposal.decisionMetadata.decidedBy}</strong></div>
                <div>Timestamp: <strong className="text-slate-900">{new Date(proposal.decisionMetadata.decidedAt).toLocaleString()}</strong></div>
              </div>
              {proposal.decisionMetadata.notes && (
                <div className="text-slate-600 pt-1 border-t border-institutional-border font-sans text-xs">
                  PM Rationale: <span className="text-slate-800">{proposal.decisionMetadata.notes}</span>
                </div>
              )}
            </div>
          )}

          {/* Decision Workflow Input for Pending */}
          {proposal.status === 'pending' && (
            <div className="space-y-1.5 pt-2 border-t border-institutional-border">
              <label className="block text-xs font-medium text-slate-700">
                Portfolio Manager Authorization Notes (Audit Compliance Annotation):
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter PM rationale for compliance and audit trail..."
                className="w-full bg-white border border-institutional-border rounded p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-sans"
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-institutional-border bg-slate-50 flex flex-wrap items-center justify-between gap-3 sticky bottom-0">
          <div className="text-xs text-slate-500 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {isPM ? (
                <>Authorized session: <strong className="text-slate-700">{user?.name}</strong> (Portfolio Manager)</>
              ) : (
                <>Read-Only Mode: Role <strong className="text-slate-700">{user?.role}</strong> requires Portfolio Manager credentials to authorize.</>
              )}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-institutional-border font-medium py-1.5 px-3 rounded text-xs transition-colors cursor-pointer"
            >
              Close
            </button>

            {proposal.status === 'pending' && isPM && (
              <>
                <button
                  onClick={handleReject}
                  className="bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-institutional-border hover:border-rose-300 font-medium py-1.5 px-3 rounded text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject Proposal</span>
                </button>
                <button
                  onClick={handleApprove}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium py-1.5 px-3 rounded text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorize & Approve</span>
                </button>
              </>
            )}

            {proposal.status === 'approved' && isPM && (
              <button
                onClick={handleSimulateExecute}
                className="bg-blue-700 hover:bg-blue-600 text-white font-medium py-1.5 px-3 rounded text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simulate Order Routing</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
