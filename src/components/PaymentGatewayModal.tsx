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
  ArrowRight
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-institutional-border rounded max-w-lg w-full shadow-lg overflow-hidden relative">
        {/* Institutional Dialog Header */}
        <div className="bg-slate-50 border-b border-institutional-border px-4 py-3 flex items-center justify-between text-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-blue-700 flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs">
              αG
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-xs tracking-tight uppercase font-mono">
                  Margin Settlement & Capital Sweep
                </span>
                <span className="bg-slate-100 text-slate-600 border border-slate-300 px-1 py-0.2 rounded text-[10px] font-mono">
                  SIMULATED
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans">Authorized Clearing & Collateral Facility</p>
            </div>
          </div>

          {step === 'checkout' && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* State 1: Checkout View */}
        {step === 'checkout' && (
          <div className="p-4 space-y-4">
            {/* Destination Summary Box */}
            <div className="bg-slate-50 border border-institutional-border rounded p-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Mandate Destination</span>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">{portfolio.code} — {portfolio.name}</div>
                <div className="text-xs text-slate-500 mt-0.5 font-mono tabular-nums">
                  Current Cash: <strong className="text-slate-800">${(portfolio.cashBalance / 1e6).toFixed(1)}M</strong>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Allocation Size</span>
                <div className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                  ${(effectiveAmount / 1e6).toFixed(1)}M
                </div>
              </div>
            </div>

            {/* Quick Amount Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Select Allocation Size:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt.value}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt.value);
                      setCustomAmount('');
                    }}
                    className={`p-1.5 rounded border text-xs font-mono font-medium transition-colors cursor-pointer tabular-nums ${
                      effectiveAmount === amt.value && !customAmount
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                        : 'bg-white border-institutional-border text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {amt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Options */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Settlement Method:</label>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ACH')}
                  className={`w-full p-2.5 rounded border text-xs text-left transition-colors flex items-center justify-between cursor-pointer ${
                    paymentMethod === 'ACH'
                      ? 'bg-blue-50/50 border-blue-500 shadow-xs'
                      : 'bg-white border-institutional-border hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded bg-slate-50 text-slate-700 border border-institutional-border">
                      <Landmark className="w-4 h-4 text-blue-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Institutional ACH / Fedwire Sweep</div>
                      <div className="text-xs text-slate-500">Direct settlement to collateral custodian account</div>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-4 h-4 ${paymentMethod === 'ACH' ? 'text-blue-700' : 'text-slate-300'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('WIRE')}
                  className={`w-full p-2.5 rounded border text-xs text-left transition-colors flex items-center justify-between cursor-pointer ${
                    paymentMethod === 'WIRE'
                      ? 'bg-blue-50/50 border-blue-500 shadow-xs'
                      : 'bg-white border-institutional-border hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded bg-slate-50 text-slate-700 border border-institutional-border">
                      <Building2 className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Bank Wire Transfer</div>
                      <div className="text-xs text-slate-500">Fedwire / SWIFT MT103 authenticated clearing</div>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-4 h-4 ${paymentMethod === 'WIRE' ? 'text-blue-700' : 'text-slate-300'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`w-full p-2.5 rounded border text-xs text-left transition-colors flex items-center justify-between cursor-pointer ${
                    paymentMethod === 'CARD'
                      ? 'bg-blue-50/50 border-blue-500 shadow-xs'
                      : 'bg-white border-institutional-border hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded bg-slate-50 text-slate-700 border border-institutional-border">
                      <CreditCard className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Corporate Treasury Purchasing Card</div>
                      <div className="text-xs text-slate-500">Direct commercial credit line with immediate draw</div>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-4 h-4 ${paymentMethod === 'CARD' ? 'text-blue-700' : 'text-slate-300'}`} />
                </button>
              </div>
            </div>

            {/* Custom Amount / Reference Note */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-xs font-mono text-slate-600 mb-1">Custom Amount ($ USD):</label>
                <input
                  type="number"
                  placeholder="e.g. 15000000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-white border border-institutional-border focus:border-blue-600 rounded px-2.5 py-1 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-600 mb-1">Audit Reference Memo:</label>
                <input
                  type="text"
                  value={referenceNote}
                  onChange={(e) => setReferenceNote(e.target.value)}
                  className="w-full bg-white border border-institutional-border focus:border-blue-600 rounded px-2.5 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Security Badge & Authorize CTA */}
            <div className="pt-3 border-t border-institutional-border space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dual-Control Mandate Clearance</span>
                </span>
                <span className="flex items-center space-x-1 text-slate-500 font-mono">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>256-Bit TLS</span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleAuthorize}
                disabled={effectiveAmount <= 0}
                className="w-full bg-blue-700 hover:bg-blue-600 active:bg-blue-800 disabled:opacity-40 text-white font-medium py-2 px-3 rounded text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Authorize ${(effectiveAmount / 1e6).toFixed(1)}M Capital Deposit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* State 2: Processing State */}
        {step === 'processing' && (
          <div className="p-8 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-blue-700" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-900">Authorizing Settlement</h3>
              <p className="text-xs text-slate-500 font-sans max-w-xs">
                Executing simulated transaction verification through clearinghouse gateway...
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-600 bg-slate-50 border border-institutional-border px-2 py-0.5 rounded">
              <Lock className="w-3 h-3 text-blue-700" />
              <span>Fedwire Routing Code: #8921-FED-CLEAR</span>
            </div>
          </div>
        )}

        {/* State 3: Success State */}
        {step === 'success' && (
          <div className="p-8 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs animate-in zoom-in-75 duration-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-900">Settlement Complete</h3>
              <p className="text-xs text-slate-500 font-sans max-w-xs">
                ${(effectiveAmount / 1e6).toFixed(1)}M successfully credited to portfolio cash buffer.
              </p>
            </div>
            <div className="bg-slate-50 border border-institutional-border px-2.5 py-1 rounded text-xs font-mono text-emerald-800 tabular-nums">
              New Cash Balance: ${( (portfolio.cashBalance + effectiveAmount) / 1e6).toFixed(1)}M
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
