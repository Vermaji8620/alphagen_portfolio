import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Wallet,
  Search,
  SlidersHorizontal
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
import { useTheme } from '../context/ThemeContext';
import { PaymentGatewayModal } from './PaymentGatewayModal';

interface PortfolioOverviewProps {
  onNavigateToStrategies: () => void;
  onNavigateToRisk: () => void;
  onNavigateToSimulations: () => void;
}

const SECTOR_COLORS_WORKSTATION = [
  '#1e40af', '#2563eb', '#0284c7', '#0f766e', '#16a34a', '#d97706', '#475569', '#64748b'
];

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  onNavigateToStrategies,
  onNavigateToRisk
}) => {
  const { isLight } = useTheme();
  const { selectedPortfolio, sectorExposures, proposals, depositFunds } = useAlphaGen();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [holdingSearch, setHoldingSearch] = useState('');
  const [holdingSortBy, setHoldingSortBy] = useState<'weight' | 'marketValue' | 'unrealizedPnL'>('weight');

  const activeSectors = sectorExposures[selectedPortfolio.id] || [];
  const pendingProposals = proposals.filter(p => p.portfolioId === selectedPortfolio.id && p.status === 'pending');

  const formatCurrency = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    if (val >= 1e3) return `$${(val / 1e3).toFixed(1)}K`;
    return `$${val.toLocaleString()}`;
  };

  const filteredHoldings = selectedPortfolio.holdings
    .filter(h =>
      h.symbol.toLowerCase().includes(holdingSearch.toLowerCase()) ||
      h.name.toLowerCase().includes(holdingSearch.toLowerCase()) ||
      h.sector.toLowerCase().includes(holdingSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (holdingSortBy === 'weight') return b.weight - a.weight;
      if (holdingSortBy === 'marketValue') return b.marketValue - a.marketValue;
      if (holdingSortBy === 'unrealizedPnL') return b.unrealizedPnL - a.unrealizedPnL;
      return 0;
    });

  return (
    <div className="space-y-3">
      {/* 1. Compact Horizontal Summary Strip (FactSet Portfolio Analytics style) */}
      <div className="bg-institutional-panel border border-institutional-border rounded p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        {/* AUM & Cash */}
        <div className="flex items-center space-x-3 pr-3 border-r border-institutional-border">
          <div>
            <div className="text-xs uppercase font-mono text-slate-500 font-semibold tracking-wider">Portfolio AUM</div>
            <div className="font-mono font-bold text-base text-slate-900 tabular-nums">
              {formatCurrency(selectedPortfolio.aum)}
            </div>
          </div>
          <div className="text-xs font-mono text-slate-600">
            <div>Cash: <span className="font-semibold text-slate-800 tabular-nums">{formatCurrency(selectedPortfolio.cashBalance)}</span></div>
            <div className="text-xs text-slate-500">({((selectedPortfolio.cashBalance / selectedPortfolio.aum) * 100).toFixed(1)}% buffer)</div>
          </div>
        </div>

        {/* Daily P&L */}
        <div className="pr-3 border-r border-institutional-border">
          <div className="text-xs uppercase font-mono text-slate-500 font-semibold tracking-wider">Daily P&L</div>
          <div className="flex items-center space-x-1.5 font-mono">
            <span className={`font-bold text-base tabular-nums ${selectedPortfolio.dailyPnL >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {selectedPortfolio.dailyPnL >= 0 ? '+' : ''}{formatCurrency(selectedPortfolio.dailyPnL)}
            </span>
            <span className={`text-xs font-semibold tabular-nums ${selectedPortfolio.dailyPnLPercent >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              ({selectedPortfolio.dailyPnLPercent >= 0 ? '+' : ''}{selectedPortfolio.dailyPnLPercent}%)
            </span>
          </div>
        </div>

        {/* Cumulative Total P&L & YTD */}
        <div className="pr-3 border-r border-institutional-border">
          <div className="text-xs uppercase font-mono text-slate-500 font-semibold tracking-wider">Cumulative Total P&L</div>
          <div className="flex items-center space-x-2 font-mono">
            <span className="font-bold text-base text-slate-900 tabular-nums">
              +{formatCurrency(selectedPortfolio.totalPnL)}
            </span>
            <span className="text-emerald-700 font-semibold text-xs tabular-nums">
              (+{selectedPortfolio.totalPnLPercent}% Inc.)
            </span>
            <span className="text-xs text-slate-500">
              YTD: <strong className="text-slate-800 tabular-nums">+{selectedPortfolio.ytdReturn}%</strong>
            </span>
          </div>
        </div>

        {/* Risk Profile Overview */}
        <div className="pr-3 border-r border-institutional-border hidden xl:block">
          <div className="text-xs uppercase font-mono text-slate-500 font-semibold tracking-wider">Risk Profile</div>
          <div className="flex items-center space-x-3 font-mono text-xs">
            <span>Sharpe: <strong className="text-slate-900 tabular-nums">{selectedPortfolio.riskMetrics.sharpeRatio}</strong></span>
            <span>VaR 99%: <strong className="text-rose-700 tabular-nums">{selectedPortfolio.riskMetrics.var99}%</strong></span>
            <span>Max DD: <strong className="text-slate-700 tabular-nums">{selectedPortfolio.riskMetrics.maxDrawdownHistorical}%</strong></span>
            <span>Target Vol: <strong className="text-slate-700 tabular-nums">{selectedPortfolio.targetVolatility}%</strong></span>
          </div>
        </div>

        {/* Quick Toolbar Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {pendingProposals.length > 0 && (
            <button
              onClick={onNavigateToStrategies}
              className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Review pending proposals"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              <span>{pendingProposals.length} Pending Proposal{pendingProposals.length > 1 ? 's' : ''}</span>
            </button>
          )}
          <button
            onClick={() => setIsDepositOpen(true)}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Wallet className="w-3.5 h-3.5 text-slate-500" />
            <span>Deposit Margin</span>
          </button>
          <button
            onClick={onNavigateToRisk}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
            <span>Factor Risk</span>
          </button>
        </div>
      </div>

      {/* 2. Side-by-Side 2-Column Analytical Panels: Performance Chart & Sector Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Column: Benchmark-Performance Chart (col-span-7) */}
        <div className="lg:col-span-7 bg-institutional-panel border border-institutional-border rounded overflow-hidden shadow-xs flex flex-col justify-between">
          <div className="px-3.5 py-2.5 border-b border-institutional-border flex items-center justify-between bg-slate-50/70">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Benchmark-Relative Cumulative Performance</h3>
              <p className="text-xs text-slate-500 font-sans">Indexed to 2024 inception (USD) vs {selectedPortfolio.benchmark}</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-sans">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-800"></span>
                <span className="text-slate-800 font-medium">AlphaGen Strategy</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-0.5 bg-slate-500"></span>
                <span className="text-slate-600 font-mono text-xs">{selectedPortfolio.benchmark}</span>
              </div>
            </div>
          </div>

          <div className="p-3 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedPortfolio.historicalPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPortWorkstation" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 10, fontFamily: 'monospace' }}
                  tickFormatter={(val) => `$${(val / 1e9).toFixed(1)}B`}
                  domain={['dataMin - 100000000', 'dataMax + 100000000']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    color: '#0f172a',
                    borderRadius: '3px',
                    fontSize: '11px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                  formatter={(val: any) => [`$${(val / 1e9).toFixed(3)}B`, 'Value']}
                />
                <Area type="monotone" dataKey="portfolioValue" name="AlphaGen" stroke="#1e40af" strokeWidth={1.75} fillOpacity={1} fill="url(#colorPortWorkstation)" />
                <Area type="monotone" dataKey="benchmarkValue" name="Benchmark" stroke="#64748b" strokeWidth={1.25} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Sector & Asset Allocation (col-span-5) */}
        <div className="lg:col-span-5 bg-institutional-panel border border-institutional-border rounded overflow-hidden shadow-xs flex flex-col justify-between">
          <div className="px-3.5 py-2.5 border-b border-institutional-border flex items-center justify-between bg-slate-50/70">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Sector Allocation Breakdown</h3>
              <p className="text-xs text-slate-500 font-sans">Active sector weights relative to benchmark</p>
            </div>
            <span className="text-xs font-mono text-slate-600 bg-white border border-slate-300 px-1.5 py-0.5 rounded">
              Active Weights
            </span>
          </div>

          <div className="p-3 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Donut Chart */}
            <div className="sm:col-span-5 h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeSectors}
                    dataKey="weight"
                    nameKey="sector"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={1.5}
                  >
                    {activeSectors.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={SECTOR_COLORS_WORKSTATION[index % SECTOR_COLORS_WORKSTATION.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      color: '#0f172a',
                      borderRadius: '3px',
                      fontSize: '12px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                    formatter={(val: any) => [`${val}%`, 'Weight']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Dense Sector Weight Table */}
            <div className="sm:col-span-7 space-y-1.5 overflow-y-auto max-h-44 pr-1 text-xs">
              {activeSectors.slice(0, 6).map((sec, idx) => (
                <div key={sec.sector} className="flex items-center justify-between py-0.5 border-b border-slate-100 last:border-b-0">
                  <div className="flex items-center space-x-1.5 truncate pr-2">
                    <span className="w-2 h-2 rounded-xs shrink-0" style={{ backgroundColor: SECTOR_COLORS_WORKSTATION[idx % SECTOR_COLORS_WORKSTATION.length] }}></span>
                    <span className="text-slate-700 truncate font-medium text-xs">{sec.sector}</span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono shrink-0 tabular-nums text-xs">
                    <span className="text-slate-900 font-semibold">{sec.weight.toFixed(1)}%</span>
                    <span className={`text-xs ${sec.activeWeight >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      ({sec.activeWeight >= 0 ? '+' : ''}{sec.activeWeight.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Full-Width Holdings Table */}
      <div className="bg-institutional-panel border border-institutional-border rounded overflow-hidden shadow-xs">
        <div className="px-3.5 py-2.5 border-b border-institutional-border flex flex-wrap items-center justify-between gap-2 bg-slate-50/70">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Portfolio Holdings & Position Exposures</h3>
            <p className="text-xs text-slate-500 font-sans">Positions priced against real-time composite settlement marks</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search symbol, company, sector..."
                value={holdingSearch}
                onChange={(e) => setHoldingSearch(e.target.value)}
                className="pl-7 pr-2.5 py-1 text-xs bg-white border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-700 w-48 sm:w-60"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center space-x-1 text-xs font-mono">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={holdingSortBy}
                onChange={(e) => setHoldingSortBy(e.target.value as any)}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-blue-700 cursor-pointer"
              >
                <option value="weight">Sort by Weight</option>
                <option value="marketValue">Sort by Value</option>
                <option value="unrealizedPnL">Sort by Unrealized P&L</option>
              </select>
            </div>

            <span className="text-xs font-mono text-slate-600 bg-white border border-slate-300 px-2 py-0.5 rounded">
              {filteredHoldings.length} / {selectedPortfolio.holdings.length} Positions
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 border-b border-institutional-border text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Symbol / Asset</th>
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3 text-right">Shares / Qty</th>
                <th className="py-2.5 px-3 text-right">Avg Cost</th>
                <th className="py-2.5 px-3 text-right">Mark Price</th>
                <th className="py-2.5 px-3 text-right">Market Value</th>
                <th className="py-2.5 px-3 text-right">Weight</th>
                <th className="py-2.5 px-3 text-right">Day Chg</th>
                <th className="py-2.5 px-3 text-right">Unrealized P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs tabular-nums">
              {filteredHoldings.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-3 font-sans">
                    <div className="font-semibold text-slate-900 font-mono text-sm">{h.symbol}</div>
                    <div className="text-xs text-slate-500 truncate max-w-xs">{h.name}</div>
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-slate-700 font-sans text-xs">{h.sector}</span>
                    <div className="text-xs text-slate-500 font-sans">{h.assetClass}</div>
                  </td>
                  <td className="py-2 px-3 text-right text-slate-700">
                    {h.quantity.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600">
                    ${h.avgCost.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-right font-medium text-slate-800">
                    ${h.currentPrice.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-right font-semibold text-slate-900">
                    {formatCurrency(h.marketValue)}
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900">
                    {h.weight.toFixed(2)}%
                  </td>
                  <td className={`py-2 px-3 text-right font-medium ${h.dailyReturn >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {h.dailyReturn >= 0 ? '+' : ''}{h.dailyReturn}%
                  </td>
                  <td className="py-2 px-3 text-right">
                    <div className={`font-semibold ${h.unrealizedPnL >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {h.unrealizedPnL >= 0 ? '+' : ''}{formatCurrency(h.unrealizedPnL)}
                    </div>
                    <div className={`text-xs ${h.unrealizedPnLPercent >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {h.unrealizedPnLPercent >= 0 ? '+' : ''}{h.unrealizedPnLPercent.toFixed(2)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Settlement Dialog */}
      {isDepositOpen && (
        <PaymentGatewayModal
          portfolio={selectedPortfolio}
          onClose={() => setIsDepositOpen(false)}
          onSuccess={async (amount, paymentMethod) => {
            await depositFunds(selectedPortfolio.id, amount, paymentMethod);
          }}
        />
      )}
    </div>
  );
};
