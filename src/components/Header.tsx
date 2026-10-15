import React from 'react';
import {
  Cpu,
  RefreshCw,
  ChevronDown,
  Database,
  Moon
} from 'lucide-react';
import { useAlphaGen } from '../context/AlphaGenContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  openAgentTelemetry: () => void;
}

export const Header: React.FC<HeaderProps> = ({ openAgentTelemetry }) => {
  const { user } = useAuth();
  const { toggleTheme, isDark, isLight } = useTheme();
  const {
    portfolios,
    selectedPortfolioId,
    setSelectedPortfolioId,
    selectedPortfolio,
    resetToDefaults,
    dbConnected
  } = useAlphaGen();

  return (
    <header className="border-b border-institutional-border bg-institutional-panel sticky top-0 z-40 select-none">
      {/* Compact FactSet Workstation Persistent Header Bar */}
      <div className="h-12 px-3 sm:px-4 flex items-center justify-between gap-3 text-sm">
        {/* Left: Brand Identity & Active Mandate Context */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-blue-800 text-white flex items-center justify-center font-mono font-bold text-xs tracking-tight shadow-sm">
              αG
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-900 tracking-tight text-base font-sans">AlphaGen</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                WORKSTATION
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-300 hidden md:block" />

          {/* Mandate Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-mono hidden xl:inline">Mandate:</span>
            <div className="relative">
              <select
                value={selectedPortfolioId}
                onChange={(e) => setSelectedPortfolioId(e.target.value)}
                className="appearance-none bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded px-2.5 py-1 pr-7 text-xs font-medium cursor-pointer focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors shadow-sm"
              >
                {portfolios.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.code} — ${(p.aum / 1e9).toFixed(2)}B AUM ({p.benchmark})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2 top-2.5" />
            </div>

            <span className="text-xs font-mono text-slate-600 hidden lg:inline">
              Benchmark: <strong className="text-slate-800">{selectedPortfolio.benchmark}</strong>
            </span>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 hidden lg:inline">
              {selectedPortfolio.currentRegime}
            </span>
          </div>
        </div>

        {/* Center: System Status & Pipeline Telemetry Feed */}
        <div className="hidden 2xl:flex items-center space-x-4 text-xs text-slate-500 font-mono">
          <span className="flex items-center space-x-1">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>Store:</span>
            {dbConnected ? (
              <span className="text-emerald-700 font-medium">Atlas Live</span>
            ) : (
              <span className="text-amber-700 font-medium" title="Operating in local standby">Atlas Standby</span>
            )}
          </span>
          <span>Feeds: <strong className="text-slate-700">Composite Index</strong></span>
          <span>Engine: <strong className="text-slate-700">10k Monte Carlo</strong></span>
        </div>

        {/* Right: Workstation Tools & User Session */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Theme Toggle Button (Crescent Moon) */}
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 transition-all cursor-pointer text-xs font-mono"
            title={isDark ? "Switch to Workstation Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark/Light Mode"
          >
            <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400' : 'text-slate-600'}`} />
            <span className="hidden sm:inline text-xs">{isDark ? 'Dark' : 'Light'}</span>
          </button>

          {/* Telemetry Trigger */}
          <button
            onClick={openAgentTelemetry}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 transition-colors cursor-pointer text-xs"
            title="Inspect Agent Orchestration & Order Slicing Engine"
          >
            <Cpu className="w-3.5 h-3.5 text-blue-700" />
            <span className="hidden sm:inline text-xs font-sans">Telemetry</span>
          </button>

          {/* Reset Baseline Trigger */}
          <button
            onClick={() => {
              if (window.confirm('Reset portfolio proposals and audit records to baseline values?')) {
                resetToDefaults();
              }
            }}
            className="flex items-center space-x-1 text-slate-500 hover:text-slate-800 p-1.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            title="Reset to default prototype sample dataset"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* User Session Profile */}
          {user && (
            <div className="flex items-center pl-2.5 border-l border-slate-300">
              <div className="hidden md:block text-right leading-tight">
                <div className="text-xs font-semibold text-slate-800">
                  {user.name}
                </div>
                <div className="text-[11px] font-mono text-slate-500 uppercase">
                  {user.role === 'PORTFOLIO_MANAGER'
                    ? 'Portfolio Mgr'
                    : user.role === 'RISK_ANALYST'
                    ? 'Risk Analyst'
                    : 'Researcher'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
