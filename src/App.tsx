import React, { useState } from 'react';
import { Header } from './components/Header';
import { PortfolioOverview } from './components/PortfolioOverview';
import { StrategyReview } from './components/StrategyReview';
import { ProposalDetailModal } from './components/ProposalDetailModal';
import { FactorRiskScreen } from './components/FactorRiskScreen';
import { SimulationHistory } from './components/SimulationHistory';
import { AgentTelemetryModal } from './components/AgentTelemetryModal';
import { LoginView } from './components/LoginView';
import { StrategyProposal } from './types/alphagen';
import { useAlphaGen } from './context/AlphaGenContext';
import { useAuth } from './context/AuthContext';
import {
  AlertCircle,
  TrendingUp,
  Activity,
  Sliders,
  PlayCircle,
  LogOut
} from 'lucide-react';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState<'overview' | 'strategies' | 'risk' | 'simulations'>('overview');
  const [selectedProposal, setSelectedProposal] = useState<StrategyProposal | null>(null);
  const [activeSimulationId, setActiveSimulationId] = useState<string | null>(null);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

  const { getProposalById, apiError, clearApiError, proposals, selectedPortfolio } = useAlphaGen();

  const pendingCount = proposals.filter(p => p.status === 'pending').length;

  // Authentication Guard: Display Login screen if user is unauthenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-institutional-canvas flex flex-col items-center justify-center font-mono text-xs text-slate-500 space-y-3">
        <div className="w-7 h-7 rounded-full border-2 border-blue-700 border-t-transparent animate-spin" />
        <span>Verifying Institutional Credentials...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const handleOpenSimulation = (simId: string) => {
    setActiveSimulationId(simId);
    setCurrentTab('simulations');
  };

  const handleSelectProposalFromSim = (propId: string) => {
    const prop = getProposalById(propId);
    if (prop) {
      setSelectedProposal(prop);
    }
  };

  const navItems = [
    { id: 'overview' as const, label: 'Overview', icon: TrendingUp },
    { id: 'strategies' as const, label: 'Proposals', icon: Activity, count: pendingCount },
    { id: 'risk' as const, label: 'Factor Risk', icon: Sliders },
    { id: 'simulations' as const, label: 'Simulations', icon: PlayCircle }
  ];

  return (
    <div className="h-screen w-screen bg-institutional-canvas text-slate-900 flex flex-col font-sans overflow-hidden">
      {/* Compact Persistent FactSet Workstation Header */}
      <Header openAgentTelemetry={() => setIsTelemetryOpen(true)} />

      {/* API / DB Error Banner */}
      {apiError && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-1.5 text-xs text-rose-800 flex items-center justify-between font-mono shrink-0">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{apiError}</span>
          </div>
          <button
            onClick={clearApiError}
            className="text-rose-700 hover:text-rose-900 underline text-[11px] cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace Body: Compact Left Rail + Analytical Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Compact Left Navigation Rail */}
        <aside className="w-12 sm:w-48 bg-institutional-panel border-r border-institutional-border flex flex-col justify-between shrink-0 select-none py-2">
          <div className="space-y-0.5 px-1 sm:px-1.5">
            <div className="hidden sm:block px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Workstation
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-sm transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-500'}`} />
                    <span className="hidden sm:inline font-sans">{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="hidden sm:inline bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded text-xs font-mono font-bold leading-none">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Left Rail Footer Context & Logout */}
          <div className="px-1.5 sm:px-2 py-2 border-t border-institutional-border space-y-1.5">
            <div className="hidden sm:block px-1 text-xs font-mono text-slate-500 space-y-0.5">
              <div>Desk: <strong className="text-slate-700">{selectedPortfolio.code}</strong></div>
              <div>AUM: <strong className="text-slate-700">${(selectedPortfolio.aum / 1e9).toFixed(2)}B</strong></div>
            </div>

            <button
              onClick={logout}
              title="Log out of institutional workstation"
              className="w-full flex items-center justify-center sm:justify-start space-x-2 px-2.5 py-2 rounded text-xs text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4 shrink-0 text-slate-500" />
              <span className="hidden sm:inline font-sans font-medium text-xs">Log Out</span>
            </button>
          </div>
        </aside>

        {/* Analytical Workspace Viewport */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 bg-institutional-canvas">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'overview' && (
              <PortfolioOverview
                onNavigateToStrategies={() => setCurrentTab('strategies')}
                onNavigateToRisk={() => setCurrentTab('risk')}
                onNavigateToSimulations={() => setCurrentTab('simulations')}
              />
            )}

            {currentTab === 'strategies' && (
              <StrategyReview
                onSelectProposal={(proposal) => setSelectedProposal(proposal)}
                onOpenSimulation={handleOpenSimulation}
              />
            )}

            {currentTab === 'risk' && (
              <FactorRiskScreen />
            )}

            {currentTab === 'simulations' && (
              <SimulationHistory
                initialSelectedId={activeSimulationId}
                onSelectProposalFromSim={handleSelectProposalFromSim}
              />
            )}
          </div>
        </main>
      </div>

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <ProposalDetailModal
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          onOpenSimulation={handleOpenSimulation}
        />
      )}

      {/* Agent Telemetry Modal */}
      {isTelemetryOpen && (
        <AgentTelemetryModal
          onClose={() => setIsTelemetryOpen(false)}
        />
      )}

      {/* Compact Workstation Status & Disclosure Footer Banner */}
      <footer className="border-t border-institutional-border bg-institutional-panel py-1.5 px-4 text-center text-xs text-slate-500 font-mono shrink-0 select-none">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>AlphaGen Prototype Sandbox • Illustrative Simulated Data Only • No Live Brokerage Executions</span>
          </div>
          <div>
            <span>MSCI Barra Multi-Factor Model • Numba Monte Carlo JIT • FactSet Layout Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
