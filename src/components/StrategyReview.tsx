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
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  PlayCircle,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles
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
  const { proposals, selectedPortfolio, approveProposal, rejectProposal, simulateExecuteProposal } = useAlphaGen();
  const { hasRole } = useAuth();
  const isPM = hasRole(['PORTFOLIO_MANAGER']);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filteredProposals = proposals.filter(p => {
    // If portfolio is selected, allow filtering or viewing all
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.thesis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.trades.some(t => t.symbol.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>Pending Review</span>
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Approved by PM</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            <span>Rejected / Vetoed</span>
          </span>
        );
      case 'simulated_executed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Send className="w-3 h-3" />
            <span>Simulated Executed</span>
          </span>
        );
    }
  };

  const getCategoryBadge = (cat: StrategyCategory) => {
    switch (cat) {
      case 'momentum':
        return <span className="text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded text-[11px] font-mono">Momentum</span>;
      case 'mean_reversion':
        return <span className="text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded text-[11px] font-mono">Mean Reversion</span>;
      case 'volatility_arbitrage':
        return <span className="text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded text-[11px] font-mono">Vol Arbitrage</span>;
      case 'carry':
        return <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded text-[11px] font-mono">Carry</span>;
    }
  };

  const handleQuickApprove = (e: React.MouseEvent, prop: StrategyProposal) => {
    e.stopPropagation();
    approveProposal(prop.id);
    setActionFeedback(`Approved ${prop.code}`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleQuickReject = (e: React.MouseEvent, prop: StrategyProposal) => {
    e.stopPropagation();
    rejectProposal(prop.id);
    setActionFeedback(`Rejected ${prop.code}`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleQuickExecute = (e: React.MouseEvent, prop: StrategyProposal) => {
    e.stopPropagation();
    simulateExecuteProposal(prop.id);
    setActionFeedback(`Simulated execution dispatched for ${prop.code}`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Alert Banner */}
      {actionFeedback && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">{actionFeedback}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">Persisted to MongoDB & Audit Chain</span>
        </div>
      )}

      {/* Role Permission Context Banner */}
      {!isPM && (
        <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-3.5 flex items-start space-x-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-slate-200 font-semibold font-mono flex items-center space-x-2">
              <span>Read-Only Research Access Mode</span>
              <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.2 rounded">
                Institutional Segregation of Duties
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed font-sans">
              You are signed in with read-only permissions. You can inspect strategy theses, multi-factor Z-scores, and Monte Carlo distributions, but <strong>only a Portfolio Manager can authorize trade proposals or dispatch simulated execution slicing</strong>. Switch to <strong>Elena Rostova (PM)</strong> to test trade approval workflows.
            </p>
          </div>
        </div>
      )}

      {/* Control bar: search, category filters, status tabs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search strategy title, code, ticker (NVDA, XOM...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center space-x-1 font-mono">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Strategies</option>
              <option value="momentum">Momentum</option>
              <option value="mean_reversion">Mean Reversion</option>
              <option value="volatility_arbitrage">Volatility Arbitrage</option>
              <option value="carry">Carry</option>
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center space-x-2 border-t border-slate-800/80 pt-3">
          <span className="text-xs text-slate-400 font-mono">Status:</span>
          {[
            { id: 'all', label: 'All Proposals' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'simulated_executed', label: 'Simulated Executed' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                statusFilter === tab.id
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals List Feed */}
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-xl text-slate-400 text-xs">
            <Activity className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="font-semibold text-slate-300">No strategy proposals match the selected filters.</p>
            <p className="mt-1">Try clearing filters or changing status.</p>
          </div>
        ) : (
          filteredProposals.map(proposal => {
            const hasPassedRisk = proposal.riskChecks.every(r => r.passed);

            return (
              <div
                key={proposal.id}
                onClick={() => onSelectProposal(proposal)}
                className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 transition-all cursor-pointer shadow-sm relative group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Header, Title, Thesis */}
                  <div className="space-y-2.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-cyan-400 font-semibold text-xs tracking-wider uppercase bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                        {proposal.code}
                      </span>
                      {getCategoryBadge(proposal.category)}
                      {getStatusBadge(proposal.status)}
                      <span className="text-[11px] font-mono text-slate-400">
                        Portfolio: <strong className="text-slate-200">{proposal.portfolioCode}</strong>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {new Date(proposal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {proposal.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {proposal.thesis}
                    </p>

                    {/* Trade Legs preview */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-400 font-mono">Proposed Orders:</span>
                      {proposal.trades.map((trade, idx) => (
                        <span
                          key={idx}
                          className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                            trade.action === 'BUY'
                              ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                              : 'bg-rose-950/40 border-rose-800/40 text-rose-300'
                          }`}
                        >
                          {trade.action} {trade.shares.toLocaleString()} {trade.symbol} ({trade.targetWeightDelta >= 0 ? '+' : ''}{trade.targetWeightDelta}%)
                        </span>
                      ))}
                    </div>

                    {/* Risk constraints summary badge */}
                    <div className="flex items-center space-x-2 text-[11px] font-mono">
                      {hasPassedRisk ? (
                        <span className="flex items-center space-x-1 text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>4/4 Pre-Trade Risk Checks Passed</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-rose-400 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Risk Constraints Violated (Automatic Veto)</span>
                        </span>
                      )}
                      <span className="text-slate-600">•</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSimulation(proposal.simulationId);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 underline flex items-center space-x-1"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>View Monte Carlo (ID: {proposal.simulationId})</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Quantitative Expected Impact & Actions */}
                  <div className="lg:border-l lg:border-slate-800 lg:pl-5 flex flex-col justify-between space-y-4 shrink-0 min-w-[210px]">
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Expected Alpha:</span>
                        <span className="font-bold text-emerald-400">+{proposal.expectedImpact.expectedReturn}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sharpe Delta:</span>
                        <span className="font-semibold text-cyan-400">+{proposal.expectedImpact.expectedSharpeDelta}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">VaR Impact:</span>
                        <span className="text-slate-200">{proposal.expectedImpact.portfolioVarDelta}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Est. Slippage:</span>
                        <span className="text-slate-300">{proposal.expectedImpact.estimatedTransactionCostsBps} bps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="font-bold text-cyan-400">{proposal.confidenceScore}%</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-2 pt-1" onClick={e => e.stopPropagation()}>
                      {proposal.status === 'pending' && isPM && (
                        <>
                          <button
                            onClick={(e) => handleQuickApprove(e, proposal)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-1.5 px-3 rounded text-xs flex items-center justify-center space-x-1 shadow-sm transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={(e) => handleQuickReject(e, proposal)}
                            className="bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-700/60 py-1.5 px-2.5 rounded text-xs flex items-center justify-center transition-all"
                            title="Reject proposal"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {proposal.status === 'pending' && !isPM && (
                        <button
                          onClick={() => onSelectProposal(proposal)}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-1.5 px-3 rounded text-xs flex items-center justify-center space-x-1"
                        >
                          <span>Review Proposal (Read-Only)</span>
                        </button>
                      )}

                      {proposal.status === 'approved' && isPM && (
                        <button
                          onClick={(e) => handleQuickExecute(e, proposal)}
                          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-1.5 px-3 rounded text-xs flex items-center justify-center space-x-1 shadow-sm transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Simulate Route</span>
                        </button>
                      )}

                      {(proposal.status === 'rejected' || proposal.status === 'simulated_executed' || (proposal.status === 'approved' && !isPM)) && (
                        <button
                          onClick={() => onSelectProposal(proposal)}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-1.5 px-3 rounded text-xs flex items-center justify-center space-x-1"
                        >
                          <span>View Details</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
