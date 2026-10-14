import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building2,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Lock,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { Portfolio } from '../types/alphagen';

interface PaymentGatewayModalProps {
  portfolio: Portfolio;
  onClose: () => void;
  onSuccess: (amount: number, paymentMethod: string) => Promise<void>;
}

type PaymentMethod = 'CARD' | 'WIRE' | 'ACH';
type Step = 'checkout' | 'processing' | 'success';

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  portfolio,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<Step>('checkout');
  const [selectedAmount, setSelectedAmount] = useState<number>(10000000); // Default $10M
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ACH');
  const [referenceNote, setReferenceNote] = useState<string>('Tier 1 Margin Buffer Replenishment');

  // Amount options common in institutional quantitative trading
  const PRESET_AMOUNTS = [
    { label: '$5,000,000', value: 5000000 },
    { label: '$10,000,000', value: 10000000 },
    { label: '$25,000,000', value: 25000000 },
    { label: '$50,000,000', value: 50000000 },
  ];

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleAuthorize = async () => {
    if (effectiveAmount <= 0) return;
    setStep('processing');

    // 2.5 second simulated secure transaction processing
    setTimeout(async () => {
      try {
        const methodLabel =
          paymentMethod === 'ACH'
            ? 'Institutional Fedwire / ACH'
            : paymentMethod === 'WIRE'
            ? 'Bank Wire Transfer'
            : 'Corporate Treasury Card';

        await onSuccess(effectiveAmount, methodLabel);
        setStep('success');

        // 1.5 seconds on success screen then auto-close
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (err) {
        console.error('Payment authorization failed:', err);
        setStep('checkout');
      }
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden relative transition-all">
        {/* Razorpay-style Gradient Header Bar */}
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-950/40 p-1 flex items-center justify-center border border-white/20">
              <span className="font-extrabold text-cyan-300 font-mono text-sm">αG</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm tracking-tight">AlphaGen Settlement Gateway</span>
                <span className="bg-white/20 text-white px-1.5 py-0.2 rounded text-[10px] font-mono font-medium">SIMULATED</span>
              </div>
              <p className="text-[11px] text-cyan-100/90 font-mono">Secured Institutional Margin Facility</p>
            </div>
          </div>

          {step === 'checkout' && (
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* State 1: Checkout View */}
        {step === 'checkout' && (
          <div className="p-6 space-y-5">
            {/* Invoice Summary Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Mandate Collateral Destination</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{portfolio.code} — {portfolio.name}</div>
                <div className="text-xs text-slate-400 mt-0.5 font-mono">
                  Current Cash Buffer: <strong className="text-slate-200">${(portfolio.cashBalance / 1e6).toFixed(1)}M</strong>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Deposit Amount</span>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  ${(effectiveAmount / 1e6).toFixed(1)}M
                </div>
              </div>
            </div>

            {/* Quick Amount Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-400">Select Margin Replenishment Size:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt.value}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt.value);
                      setCustomAmount('');
                    }}
                    className={`p-2 rounded-lg border text-xs font-mono font-semibold transition-all ${
                      effectiveAmount === amt.value && !customAmount
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {amt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mock Payment Method Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-400">Select Institutional Settlement Method:</label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ACH')}
                  className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                    paymentMethod === 'ACH'
                      ? 'bg-slate-800 border-cyan-500/80 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">Institutional ACH / Fedwire Sweep</div>
                      <div className="text-[11px] text-slate-400 font-mono">Instant settlement to collateral custodian account</div>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-4 h-4 ${paymentMethod === 'ACH' ? 'text-cyan-400' : 'text-slate-700'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('WIRE')}
                  className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                    paymentMethod === 'WIRE'
                      ? 'bg-slate-800 border-cyan-500/80 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/40">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">Bank Wire Transfer (SWIFT / CHIPS)</div>
                      <div className="text-[11px] text-slate-400 font-mono">Direct central bank ledger debit (USD)</div>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-4 h-4 ${paymentMethod === 'WIRE' ? 'text-cyan-400' : 'text-slate-700'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                    paymentMethod === 'CARD'
                      ? 'bg-slate-800 border-cyan-500/80 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/40">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">Corporate Treasury Credit Line</div>
                      <div className="text-[11px] text-slate-400 font-mono">Billed to institutional clearing broker account</div>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-4 h-4 ${paymentMethod === 'CARD' ? 'text-cyan-400' : 'text-slate-700'}`} />
                </button>
              </div>
            </div>

            {/* Reference Note */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-400">Settlement Reference Note:</label>
              <input
                type="text"
                value={referenceNote}
                onChange={(e) => setReferenceNote(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* CTA Button */}
            <button
              onClick={handleAuthorize}
              disabled={effectiveAmount <= 0}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Authorize & Deposit ${(effectiveAmount / 1e6).toFixed(1)}M USD</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] font-mono text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulated Payment Gateway Sandbox • No Real Funds Transferred</span>
            </div>
          </div>
        )}

        {/* State 2: Processing State */}
        {step === 'processing' && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin flex items-center justify-center" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-100">Processing Secure Settlement...</h3>
              <p className="text-xs text-slate-400 font-mono">
                Authorizing ${(effectiveAmount / 1e6).toFixed(1)}M USD deposit to {portfolio.code} custodian sweep.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-4 py-2 text-[11px] font-mono text-slate-400">
              Verifying cryptographic bank authorization token (2.5s simulated delay)
            </div>
          </div>
        )}

        {/* State 3: Success State */}
        {step === 'success' && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/60">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-emerald-400">Payment & Deposit Successful!</h3>
              <p className="text-xs text-slate-300 font-mono">
                +${(effectiveAmount / 1e6).toFixed(1)}M USD credited to {portfolio.code} Cash Buffer.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-[11px] font-mono text-slate-400">
              Audit log recorded • Updating portfolio metrics...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
