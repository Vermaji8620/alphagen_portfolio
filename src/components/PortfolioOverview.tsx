import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ShieldAlert,
  BarChart2,
  PieChart as PieIcon,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Compass,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAlphaGen } from '../context/AlphaGenContext';

interface PortfolioOverviewProps {
  onNavigateToStrategies: () => void;
  onNavigateToRisk: () => void;
  onNavigateToSimulations: () => void;
}

const SECTOR_COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#64748b', '#0284c7'];

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  onNavigateToStrategies,
  onNavigateToRisk,
  onNavigateToSimulations
}) => {
  const { selectedPortfolio, sectorExposures, proposals } = useAlphaGen();

  const activeSectors = sectorExposures[selectedPortfolio.id] || [];
  const pendingProposals = proposals.filter(p => p.portfolioId === selectedPortfolio.id && p.status === 'pending');

  const formatCurrency = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    if (val >= 1e3) return `$${(val / 1e3).toFixed(1)}K`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Mandate Hero Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="font-mono text-cyan-400 font-semibold text-xs tracking-wider uppercase bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                {selectedPortfolio.code}
              </span>
              <span className="text-xs text-slate-400 font-mono">Benchmark: {selectedPortfolio.benchmark}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-medium capitalize bg-slate-800 text-slate-300 border border-slate-700">
                Regime: <span className="text-cyan-400">{selectedPortfolio.currentRegime.replace('_', ' ')}</span>
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">{selectedPortfolio.name}</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">{selectedPortfolio.mandate}</p>
          </div>

          <div className="flex items-center space-x-3">
            {pendingProposals.length > 0 && (
              <button
                onClick={onNavigateToStrategies}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-md shadow-cyan-950/50 transition-all cursor-pointer"
              >
                <span>Review {pendingProposals.length} Pending Proposal{pendingProposals.length > 1 ? 's' : ''}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onNavigateToRisk}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <span>Factor Risks</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total AUM */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Portfolio AUM</span>
            <DollarSign className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {formatCurrency(selectedPortfolio.aum)}
          </div>
          <div className="flex items-center space-x-2 mt-2 text-xs">
            <span className="text-slate-400">Cash Buffer:</span>
            <span className="font-mono text-slate-300 font-medium">
              {formatCurrency(selectedPortfolio.cashBalance)} ({((selectedPortfolio.cashBalance / selectedPortfolio.aum) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Daily P&L */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Daily P&L (Continuous Tick)</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-bold font-mono ${selectedPortfolio.dailyPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {selectedPortfolio.dailyPnL >= 0 ? '+' : ''}{formatCurrency(selectedPortfolio.dailyPnL)}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs">
            <span className={`flex items-center font-semibold font-mono ${selectedPortfolio.dailyPnLPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {selectedPortfolio.dailyPnLPercent >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {selectedPortfolio.dailyPnLPercent >= 0 ? '+' : ''}{selectedPortfolio.dailyPnLPercent}%
            </span>
            <span className="text-slate-500">vs Benchmark</span>
          </div>
        </div>

        {/* Total Cumulative P&L / YTD */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Cumulative Total P&L</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            +{formatCurrency(selectedPortfolio.totalPnL)}
          </div>
          <div className="flex items-center space-x-3 mt-2 text-xs font-mono">
            <span className="text-emerald-400 font-semibold">+{selectedPortfolio.totalPnLPercent}% Inception</span>
            <span className="text-slate-400">YTD: <strong className="text-slate-200">+{selectedPortfolio.ytdReturn}%</strong></span>
          </div>
        </div>

        {/* Risk Metrics Preview (VaR 99% / Sharpe) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Risk Profile (Numba MC)</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400">Sharpe: </span>
              <span className="text-xl font-bold font-mono text-cyan-400">{selectedPortfolio.riskMetrics.sharpeRatio}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400">VaR 99%: </span>
              <span className="text-xl font-bold font-mono text-rose-400">{selectedPortfolio.riskMetrics.var99}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400 font-mono">
            <span>Hist Max DD: <strong className="text-slate-200">{selectedPortfolio.riskMetrics.maxDrawdownHistorical}%</strong></span>
            <span>Target Vol: <strong className="text-slate-200">{selectedPortfolio.targetVolatility}%</strong></span>
          </div>
        </div>
      </div>

      {/* Historical Performance Chart & Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Portfolio Performance vs Benchmark</h3>
              <p className="text-xs text-slate-400 font-mono">Rebased to inception 2024 (USD) with drawdown overlays</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-cyan-500"></span>
                <span className="text-slate-300">AlphaGen Strategy</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-600"></span>
                <span className="text-slate-400">{selectedPortfolio.benchmark}</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedPortfolio.historicalPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPort" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11, fontFamily: 'monospace' }}
                  tickFormatter={(val) => `$${(val / 1e9).toFixed(1)}B`}
                  domain={['dataMin - 100000000', 'dataMax + 100000000']}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`$${(val / 1e9).toFixed(3)}B`, 'Value']}
                />
                <Area type="monotone" dataKey="portfolioValue" name="AlphaGen" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPort)" />
                <Area type="monotone" dataKey="benchmarkValue" name="Benchmark" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Allocation Breakdown */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-200">Sector & Asset Breakdown</h3>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                Active Weights
              </span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeSectors}
                    dataKey="weight"
                    nameKey="sector"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {activeSectors.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`${val}%`, 'Weight']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
            {activeSectors.slice(0, 5).map((sec, idx) => (
              <div key={sec.sector} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 truncate pr-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length] }}></span>
                  <span className="text-slate-300 truncate">{sec.sector}</span>
                </div>
                <div className="flex items-center space-x-2 font-mono shrink-0">
                  <span className="text-slate-200 font-medium">{sec.weight}%</span>
                  <span className={`text-[10px] ${sec.activeWeight >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ({sec.activeWeight >= 0 ? '+' : ''}{sec.activeWeight}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Positions Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Current Portfolio Holdings & Positions</h3>
            <p className="text-xs text-slate-400 font-mono">Live multi-asset valuation enriched with Refinitiv / Bloomberg feeds</p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
            {selectedPortfolio.holdings.length} Active Positions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-mono border-b border-slate-800 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Instrument / Ticker</th>
                <th className="py-3 px-4">Asset Class & Sector</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4 text-right">Avg Cost</th>
                <th className="py-3 px-4 text-right">Current Price</th>
                <th className="py-3 px-4 text-right">Market Value</th>
                <th className="py-3 px-4 text-right">Weight</th>
                <th className="py-3 px-4 text-right">Daily %</th>
                <th className="py-3 px-4 text-right">Unrealized P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {selectedPortfolio.holdings.map((h) => (
                <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-slate-100 font-mono">{h.symbol}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{h.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-300 font-sans">{h.assetClass}</span>
                    <div className="text-[10px] text-slate-500 font-sans">{h.sector}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    {h.quantity.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400">
                    ${h.avgCost.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-200">
                    ${h.currentPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-100">
                    {formatCurrency(h.marketValue)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-cyan-400">
                    {h.weight.toFixed(2)}%
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${h.dailyReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {h.dailyReturn >= 0 ? '+' : ''}{h.dailyReturn}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className={`font-semibold ${h.unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {h.unrealizedPnL >= 0 ? '+' : ''}{formatCurrency(h.unrealizedPnL)}
                    </div>
                    <div className={`text-[10px] ${h.unrealizedPnLPercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {h.unrealizedPnLPercent >= 0 ? '+' : ''}{h.unrealizedPnLPercent.toFixed(2)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
