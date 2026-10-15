import React, { useState } from 'react';
import {
  StrategyProposal,
  ProposalStatus,
  StrategyCategory
} from '../types/alphagen';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Search,
  ShieldCheck,
  AlertTriangle,
  PlayCircle,
  ChevronRight,
  Sliders,
  TrendingUp,
  Key
} from 'lucide-react';
import { useAlphaGen } from '../context/AlphaGenContext';
import { useAuth } from '../context/AuthContext';

interface StrategyReviewProps {
  onSelectProposal: (proposal: StrategyProposal) => void;
  onOpenSimulation: (simulationId: string) => void;
}

export const StrategyReview: React.FC<StrategyReviewProps> = ({
  onSelectProposal,
  onOpenSimulation
}) => {
  const { proposals, approveProposal, rejectProposal, simulateExecuteProposal } = useAlphaGen();
  const { hasRole } = useAuth();
  const isPM = hasRole(['PORTFOLIO_MANAGER']);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const filteredProposals = proposals.filter(p => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.thesis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.trades.some(t => t.symbol.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const [selectedId, setSelectedId] = useState<string>(
    filteredProposals[0]?.id || proposals[0]?.id || ''
  );

  const activeProposal = proposals.find(p => p.id === selectedId) || filteredProposals[0] || proposals[0];

  const getStatusChip = (status: ProposalStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>PENDING</span>
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>APPROVED</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-700" />
            <span>VETOED</span>
          </span>
        );
      case 'simulated_executed':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-800 border border-blue-300">
            <Send className="w-3 h-3 text-blue-700" />
            <span>EXECUTED</span>
          </span>
        );
    }
  };

  const getCategoryLabel = (cat: StrategyCategory) => {
    switch (cat) {
      case 'momentum': return 'Momentum';
      case 'mean_reversion': return 'Mean Reversion';
      case 'volatility_arbitrage': return 'Vol Arbitrage';
      case 'carry': return 'Carry';
      default: return cat;
    }
  };

  const handleApprove = (prop: StrategyProposal) => {
    approveProposal(prop.id, reviewNotes || undefined);
    setActionFeedback(`Approved mandate allocation for ${prop.code}`);
    setReviewNotes('');
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleReject = (prop: StrategyProposal) => {
    rejectProposal(prop.id, reviewNotes || undefined);
    setActionFeedback(`Veto recorded for ${prop.code}`);
    setReviewNotes('');
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleExecute = (prop: StrategyProposal) => {
    simulateExecuteProposal(prop.id);
    setActionFeedback(`Orders sliced and dispatched for ${prop.code}`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  return (
    <div className="space-y-2">
      {/* Action Notification Banner */}
      {actionFeedback && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-1.5 rounded text-xs flex items-center justify-between font-mono animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-emerald-700 hover:text-emerald-900 text-[10px] cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* MSCI BarraOne Proposal-List and Proposal-Detail Master Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* ========================================================
            LEFT PANE: Proposal Inventory List (~5 cols)
           ======================================================== */}
        <div className="lg:col-span-5 bg-institutional-panel border border-institutional-border rounded overflow-hidden shadow-xs flex flex-col h-[calc(100vh-130px)]">
          {/* List Header & Filters Toolbar */}
          <div className="p-3 border-b border-institutional-border bg-slate-50/70 space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Strategy Pipeline</h3>
                <p className="text-xs font-mono text-slate-500">Autonomous Alpha Models</p>
              </div>
              <span className="text-xs font-mono bg-white border border-slate-300 px-1.5 py-0.5 rounded text-slate-600">
                {filteredProposals.length} Proposals
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search strategy, symbol, thesis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1 text-xs bg-white border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-700"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1 overflow-x-auto text-xs pb-0.5">
              {['all', 'pending', 'approved', 'rejected', 'simulated_executed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-0.5 rounded text-xs font-mono uppercase whitespace-nowrap transition-colors cursor-pointer border ${
                    statusFilter === st
                      ? 'bg-blue-800 text-white border-blue-800 font-semibold'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Proposals Scrollable List */}
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {filteredProposals.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs p-4">
                <Activity className="w-6 h-6 mx-auto text-slate-400 mb-2" />
                <p className="font-semibold text-slate-700">No strategy proposals match filters.</p>
                <p className="text-xs mt-0.5">Clear search or status criteria.</p>
              </div>
            ) : (
              filteredProposals.map((p) => {
                const isSelected = activeProposal?.id === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`p-3 transition-colors cursor-pointer border-l-3 ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-blue-800 shadow-xs'
                        : 'hover:bg-slate-50 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-slate-900 font-bold text-sm tracking-tight">
                          {p.code}
                        </span>
                        <span className="text-xs font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {getCategoryLabel(p.category)}
                        </span>
                      </div>
                      {getStatusChip(p.status)}
                    </div>

                    <div className="font-medium text-slate-800 text-sm line-clamp-1">
                      {p.title}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 mt-1">
                      <span>Confidence: <strong className="text-slate-800">{p.confidenceScore}%</strong></span>
                      <span>{new Date(p.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================
            RIGHT PANE: Active Proposal Detail Inspector (~7 cols)
            ======================================================== */}
        <div className="lg:col-span-7 bg-institutional-panel border border-institutional-border rounded overflow-hidden shadow-xs h-[calc(100vh-130px)] flex flex-col">
          {activeProposal ? (
            <>
              {/* Proposal Header Bar */}
              <div className="p-3 border-b border-institutional-border bg-slate-50/70 flex items-start justify-between gap-3 shrink-0">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="font-mono text-slate-900 font-bold text-sm uppercase bg-white border border-slate-300 px-2 py-0.5 rounded">
                      {activeProposal.code}
                    </span>
                    <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300">
                      {getCategoryLabel(activeProposal.category)}
                    </span>
                    {getStatusChip(activeProposal.status)}
                    <span className="text-xs font-mono text-slate-600">
                      Desk: <strong className="text-slate-800">{activeProposal.portfolioCode}</strong>
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Urgency: <strong className="text-slate-700 uppercase">{activeProposal.urgency}</strong>
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">{activeProposal.title}</h2>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => onOpenSimulation(activeProposal.simulationId)}
                    className="flex items-center space-x-1 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 px-2.5 py-1 rounded text-xs font-medium cursor-pointer shadow-xs"
                    title="Open Monte Carlo validation for this proposal"
                  >
                    <PlayCircle className="w-3.5 h-3.5 text-blue-700" />
                    <span>Simulation</span>
                  </button>
                  <button
                    onClick={() => onSelectProposal(activeProposal)}
                    className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-100 cursor-pointer"
                    title="Expand into full dialog view"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Proposal Content Body */}
              <div className="p-3.5 space-y-3.5 overflow-y-auto flex-1 text-xs">
                {/* Trigger & Investment Thesis */}
                <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-1.5">
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                    Market Trigger Event
                  </div>
                  <div className="font-mono text-slate-800 text-xs">
                    {activeProposal.triggerEvent}
                  </div>
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold pt-1">
                    Investment Thesis
                  </div>
                  <p className="text-slate-800 font-sans leading-relaxed text-sm">
                    {activeProposal.thesis}
                  </p>
                </div>

                {/* Quantitative Rationale Bullet Points */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                    Model Rationale & Evidence
                  </div>
                  <ul className="space-y-1 text-slate-700 text-sm">
                    {activeProposal.rationale.map((r, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-blue-800 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Supporting Factor Signals */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                    Factor Signals & Observed Z-Scores
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {activeProposal.supportingFactorSignals.map((sig, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded p-2.5 text-xs font-mono">
                        <div className="text-slate-500 text-xs truncate">{sig.factor}</div>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">{sig.observedValue}</div>
                        <div className="flex justify-between items-center text-xs mt-1 pt-1 border-t border-slate-100">
                          <span className="text-slate-500">Z: {sig.zScore.toFixed(2)}</span>
                          <span className="text-blue-700 font-medium">{sig.signalStrength}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expected Portfolio Impact */}
                <div className="bg-slate-50 border border-slate-200 rounded p-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-2">
                    Expected Portfolio Impact (Ex-Ante)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs tabular-nums text-center">
                    <div>
                      <span className="text-xs text-slate-500 block">Alpha</span>
                      <strong className="text-emerald-700 text-base">+{activeProposal.expectedImpact.expectedReturn}%</strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Sharpe Delta</span>
                      <strong className="text-slate-800 text-base">+{activeProposal.expectedImpact.expectedSharpeDelta}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">VaR Delta</span>
                      <strong className="text-slate-800 text-base">{activeProposal.expectedImpact.portfolioVarDelta}%</strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Turnover</span>
                      <strong className="text-slate-800 text-base">{activeProposal.expectedImpact.turnover}%</strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Est Costs</span>
                      <strong className="text-slate-800 text-base">{activeProposal.expectedImpact.estimatedTransactionCostsBps} bps</strong>
                    </div>
                  </div>
                </div>

                {/* Proposed Trade Legs Table with Execution Styles */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                    Proposed Trade Legs & Order Slicing
                  </div>
                  <div className="overflow-x-auto rounded border border-slate-200">
                    <table className="w-full text-xs text-left font-mono tabular-nums">
                      <thead className="bg-slate-100 text-xs text-slate-600 uppercase border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-2.5">Action</th>
                          <th className="py-2 px-2.5">Symbol</th>
                          <th className="py-2 px-2.5 text-right">Shares</th>
                          <th className="py-2 px-2.5 text-right">Price</th>
                          <th className="py-2 px-2.5 text-right">Notional</th>
                          <th className="py-2 px-2.5 text-right">Target Δ</th>
                          <th className="py-2 px-2.5">Execution Style</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeProposal.trades.map((trade, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-2.5 font-bold font-sans">
                              <span className={`px-1.5 py-0.5 rounded text-xs ${
                                trade.action === 'BUY' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {trade.action}
                              </span>
                            </td>
                            <td className="py-2 px-2.5 font-bold text-slate-900 text-sm">{trade.symbol}</td>
                            <td className="py-2 px-2.5 text-right text-slate-700">{trade.shares.toLocaleString()}</td>
                            <td className="py-2 px-2.5 text-right text-slate-600">${trade.estimatedPrice.toFixed(2)}</td>
                            <td className="py-2 px-2.5 text-right font-semibold text-slate-900">${(trade.notionalValue / 1e6).toFixed(2)}M</td>
                            <td className={`py-2 px-2.5 text-right font-medium ${trade.targetWeightDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {trade.targetWeightDelta >= 0 ? '+' : ''}{trade.targetWeightDelta}%
                            </td>
                            <td className="py-2 px-2.5 text-slate-600 text-xs font-sans">{trade.executionStyle}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pre-Trade Mandate Risk Clearance Checks */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 font-mono">
                    Mandate Risk Clearance Checks
                  </div>
                  <div className="space-y-1.5">
                    {activeProposal.riskChecks.map((check, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center space-x-2">
                          {check.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <span className="font-semibold text-slate-800 text-sm">{check.name}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs">
                          <span className="text-slate-600 font-sans">{check.details}</span>
                          <span className={`font-mono text-xs uppercase font-bold ${check.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {check.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audited Decision Record if already decided */}
                {activeProposal.decisionMetadata && (
                  <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-xs font-mono">
                    <div className="flex items-center space-x-1.5 text-slate-700 font-semibold mb-1">
                      <Key className="w-3.5 h-3.5 text-slate-500" />
                      <span>Audited PM Decision Record</span>
                    </div>
                    <div className="text-slate-600 text-xs space-y-0.5">
                      <div>Status: <strong>{activeProposal.decisionMetadata.decision}</strong> by <strong>{activeProposal.decisionMetadata.decidedBy}</strong></div>
                      <div>Timestamp: {new Date(activeProposal.decisionMetadata.decidedAt).toLocaleString()}</div>
                      {activeProposal.decisionMetadata.notes && (
                        <div>Notes: {activeProposal.decisionMetadata.notes}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* PM Authorization Footer Toolbar */}
              <div className="p-3 border-t border-institutional-border bg-slate-50/90 flex flex-wrap items-center justify-between gap-2 shrink-0">
                {activeProposal.status === 'pending' && isPM ? (
                  <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder="Optional authorization notes..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      className="flex-1 w-full sm:w-auto px-2.5 py-1 text-xs bg-white border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-700"
                    />
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleReject(activeProposal)}
                        className="px-3 py-1.5 rounded bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-rose-700 text-xs font-medium cursor-pointer transition-colors"
                      >
                        Veto Proposal
                      </button>
                      <button
                        onClick={() => handleApprove(activeProposal)}
                        className="px-3.5 py-1.5 rounded bg-blue-800 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer shadow-xs transition-colors"
                      >
                        Approve Mandate Allocation
                      </button>
                    </div>
                  </div>
                ) : activeProposal.status === 'approved' && isPM ? (
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-800 font-medium">
                      ✓ Mandate cleared. Ready for execution routing.
                    </span>
                    <button
                      onClick={() => handleExecute(activeProposal)}
                      className="px-3.5 py-1.5 rounded bg-blue-800 hover:bg-blue-700 text-white text-xs font-medium flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Simulate Order Route (Almgren-Chriss Slicing)</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Proposal status: <strong className="uppercase text-slate-800">{activeProposal.status.replace('_', ' ')}</strong></span>
                    <span className="text-xs">Audit log immutable</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500 text-xs">
              Select a strategy proposal from the left list to review detailed metrics and risk clearances.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
