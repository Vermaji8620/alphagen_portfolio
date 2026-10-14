import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Cpu
} from 'lucide-react';
import { UserRole } from '../types/alphagen';

interface SeededAccount {
  name: string;
  email: string;
  role: string;
  title: string;
  department: string;
  defaultPassword: string;
}

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('pm@alphagen.internal');
  const [password, setPassword] = useState('alphagen2024');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [seededAccounts, setSeededAccounts] = useState<SeededAccount[]>([]);

  useEffect(() => {
    api.getSeededAccounts().then(accounts => {
      if (accounts.length > 0) {
        setSeededAccounts(accounts);
      }
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectAccount = (acc: SeededAccount) => {
    setEmail(acc.email);
    setPassword(acc.defaultPassword);
    setError(null);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'PORTFOLIO_MANAGER':
        return <span className="bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded text-[10px] font-mono">PORTFOLIO MANAGER</span>;
      case 'RISK_ANALYST':
        return <span className="bg-rose-950/80 text-rose-400 border border-rose-800/60 px-2 py-0.5 rounded text-[10px] font-mono">RISK ANALYST</span>;
      case 'QUANT_RESEARCHER':
        return <span className="bg-purple-950/80 text-purple-400 border border-purple-800/60 px-2 py-0.5 rounded text-[10px] font-mono">QUANT RESEARCHER</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Decorative Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-xl shadow-cyan-950/50 mb-1">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-xl font-mono tracking-tighter">αG</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">AlphaGen Terminal</h1>
          <p className="text-xs text-slate-400 font-mono">Institutional Quantitative Strategy & Risk Engine</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-950/80 border border-rose-800 text-rose-300 px-3.5 py-2.5 rounded-lg text-xs font-mono flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-400">Institutional Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pm@alphagen.internal"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-400">Password / Token</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg text-xs shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center space-x-2"
            >
              <span>{submitting ? 'Verifying Credentials...' : 'Authenticate & Enter Terminal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick-Fill Seeded Accounts for Demo */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Predefined Institutional Accounts:</span>
              </span>
              <span className="text-[10px] text-slate-500">Click to autofill</span>
            </div>

            <div className="space-y-2">
              {(seededAccounts.length > 0 ? seededAccounts : [
                {
                  name: 'Elena Rostova',
                  email: 'pm@alphagen.internal',
                  role: 'PORTFOLIO_MANAGER',
                  title: 'Senior Portfolio Manager (Alpha Mandates)',
                  department: 'Quantitative Equity Strategies',
                  defaultPassword: 'alphagen2024'
                },
                {
                  name: 'Marcus Vance',
                  email: 'risk@alphagen.internal',
                  role: 'RISK_ANALYST',
                  title: 'Head of Market Risk & Stress Testing',
                  department: 'Institutional Risk Oversight',
                  defaultPassword: 'alphagen2024'
                },
                {
                  name: 'Dr. Liam Thorne',
                  email: 'quant@alphagen.internal',
                  role: 'QUANT_RESEARCHER',
                  title: 'Principal Quantitative Researcher',
                  department: 'Multi-Asset Model Development',
                  defaultPassword: 'alphagen2024'
                }
              ]).map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectAccount(acc)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs font-sans transition-all flex items-center justify-between ${
                    email === acc.email
                      ? 'bg-slate-800/80 border-cyan-500/60 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-200">{acc.name}</span>
                      {getRoleBadge(acc.role)}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{acc.email}</div>
                  </div>
                  <CheckCircle2 className={`w-4 h-4 ${email === acc.email ? 'text-cyan-400' : 'text-slate-700'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Token Disclosure */}
        <div className="text-center text-[11px] text-slate-500 font-mono">
          <span>Role-Based Access Control • Signed HMAC SHA-256 JWT • Bcrypt Password Hashing</span>
        </div>
      </div>
    </div>
  );
};
