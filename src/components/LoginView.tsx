import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Moon
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-institutional-canvas text-slate-900 flex flex-col justify-center items-center p-4 relative">
      {/* Top-Right Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-white border border-institutional-border text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-xs text-xs font-mono"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Dark/Light Mode"
        >
          <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400' : 'text-slate-600'}`} />
          <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex w-9 h-9 rounded bg-blue-700 items-center justify-center text-white font-mono font-bold text-sm shadow-xs mb-1">
            αG
          </div>
          <h1 className="text-base font-semibold tracking-tight text-slate-900 font-mono">
            AlphaGen Workstation
          </h1>
          <p className="text-xs text-slate-500">
            Institutional Portfolio Analytics & Factor Risk Terminal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-institutional-border rounded p-5 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 px-2.5 py-1.5 rounded text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">Work Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@firm.com"
                  className="w-full bg-white border border-institutional-border focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded pl-8 pr-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">Password / Token</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-institutional-border focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded pl-8 pr-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !email || !password}
              className="w-full bg-blue-700 hover:bg-blue-600 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-1.5 px-3 rounded text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        {/* Security Disclosure */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center space-x-1.5 font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Role-Based Institutional Access • Encrypted Session</span>
        </div>
      </div>
    </div>
  );
};
