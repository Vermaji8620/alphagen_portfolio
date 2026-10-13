import React from 'react';
import {
  TrendingUp,
  Activity,
  Sliders,
  PlayCircle,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Layers,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { useAlphaGen } from '../context/AlphaGenContext';

interface HeaderProps {
  currentTab: 'overview' | 'strategies' | 'risk' | 'simulations';
  setCurrentTab: (tab: 'overview' | 'strategies' | 'risk' | 'simulations') => void;
  openAgentTelemetry: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, openAgentTelemetry }) => {
  const { portfolios, selectedPortfolioId, setSelectedPortfolioId, selectedPortfolio, proposals, resetToDefaults } = useAlphaGen();

  const pendingCount = proposals.filter(p => p.status === 'pending').length;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      {/* Top tier: Institutional prototype ticker bar & simulated cluster telemetry */}
      <div className="border-b border-slate-800/60 px-4 py-1.5 flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 font-mono">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-semibold tracking-wide">ALPHAGEN PROTOTYPE SANDBOX</span>
            <span className="bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded text-[10px] border border-slate-700">SIMULATED DATA</span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-slate-400">
            <span>EVENT INGESTION: <strong className="text-slate-300">50k evt/s (Simulated Bus)</strong></span>
            <span>REFERENCE FEEDS: <strong className="text-emerald-400">Illustrative Market Data</strong></span>
            <span>SIMULATION ENGINE: <strong className="text-cyan-400">10k Paths (Precomputed Model)</strong></span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={openAgentTelemetry}
            className="flex items-center space-x-1.5 text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/50 px-2 py-0.5 rounded text-[11px]"
            title="Inspect Agent Orchestration & Kafka Topology"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Agent Telemetry</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all proposals and mock audit history to default case-study baseline?')) {
                resetToDefaults();
              }
            }}
            className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition-colors text-[11px]"
            title="Reset prototype local state"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset State</span>
          </button>
        </div>
      </div>

      {/* Main navigation and Portfolio Selector */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-950/40">
            <div className="w-full h-full bg-slate-900 rounded-[7px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-lg font-mono tracking-tighter">αG</span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-slate-100 text-base tracking-tight font-sans">AlphaGen</h1>
              <span className="bg-cyan-900/40 text-cyan-400 border border-cyan-700/50 px-1.5 py-0.2 rounded text-[10px] font-mono font-medium">v2.4 INSTITUTIONAL</span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Autonomous Agentic Quantitative Strategy & Risk Engine</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all ${
              currentTab === 'overview'
                ? 'bg-slate-800 text-cyan-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Portfolio Overview</span>
          </button>

          <button
            onClick={() => setCurrentTab('strategies')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all relative ${
              currentTab === 'strategies'
                ? 'bg-slate-800 text-cyan-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Strategy Proposals</span>
            {pendingCount > 0 && (
              <span className="ml-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.2 text-[10px] rounded-full font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('risk')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all ${
              currentTab === 'risk'
                ? 'bg-slate-800 text-cyan-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Factor & Risk Analytics</span>
          </button>

          <button
            onClick={() => setCurrentTab('simulations')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all ${
              currentTab === 'simulations'
                ? 'bg-slate-800 text-cyan-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Monte Carlo Simulations</span>
          </button>
        </nav>

        {/* Portfolio Selector Dropdown */}
        <div className="flex items-center space-x-2">
          <div className="text-right hidden xl:block">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Active Mandate</div>
            <div className="text-xs font-semibold text-slate-200">{selectedPortfolio.name}</div>
          </div>
          <div className="relative">
            <select
              value={selectedPortfolioId}
              onChange={(e) => setSelectedPortfolioId(e.target.value)}
              className="appearance-none bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg px-3 py-2 pr-8 text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors shadow-sm"
            >
              {portfolios.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} — ${(p.aum / 1e9).toFixed(2)}B AUM ({p.benchmark})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 top-2.5" />
          </div>
        </div>
      </div>
    </header>
  );
};
