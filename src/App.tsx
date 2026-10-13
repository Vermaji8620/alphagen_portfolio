import React, { useState } from 'react';
import { Header } from './components/Header';
import { PortfolioOverview } from './components/PortfolioOverview';
import { StrategyReview } from './components/StrategyReview';
import { ProposalDetailModal } from './components/ProposalDetailModal';
import { FactorRiskScreen } from './components/FactorRiskScreen';
import { SimulationHistory } from './components/SimulationHistory';
import { AgentTelemetryModal } from './components/AgentTelemetryModal';
import { StrategyProposal } from './types/alphagen';
import { useAlphaGen } from './context/AlphaGenContext';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'overview' | 'strategies' | 'risk' | 'simulations'>('overview');
  const [selectedProposal, setSelectedProposal] = useState<StrategyProposal | null>(null);
  const [activeSimulationId, setActiveSimulationId] = useState<string | null>(null);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

  const { getProposalById } = useAlphaGen();

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openAgentTelemetry={() => setIsTelemetryOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
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
      </main>

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

      {/* Institutional Prototype Footer Banner */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-3 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>AlphaGen Prototype Sandbox • Illustrative Simulated Data Only • No Live Brokerage Executions</span>
          </div>
          <div>
            <span>Architecture: Bloomberg DL / Refinitiv • Kafka • Numba JIT • React PM Dashboard</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
