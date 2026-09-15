import React, { useState } from 'react';
import { X, PlusCircle, Sparkles, Tag, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatRupiah } from '../utils/formatters';
import { playCoinSound, playCelebrationSound } from '../utils/audio';
import { Celengan } from '../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  celengan: Celengan;
  currentBalance: number;
  isMuted: boolean;
  onDeposit: (amount: number, note: string, category: string) => void;
}

const QUICK_AMOUNTS = [
  5000,
  10000,
  20000,
  50000,
  100000,
  200000,
  500000,
];

const CATEGORIES = [
  'Uang Jajan',
  'Sisa Belanja',
  'Bonus / THR',
  'Gaji',
  'Uang Kembalian',
  'Celengan Harian',
  'Hadiah',
  'Lainnya',
];

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  celengan,
  currentBalance,
  isMuted,
  onDeposit,
}) => {
  const [amount, setAmount] = useState<number>(50000);
  const [rawInput, setRawInput] = useState<string>('50000');
  const [note, setNote] = useState<string>('');
  const [category, setCategory] = useState<string>('Celengan Harian');

  if (!isOpen) return null;

  const handleQuickAdd = (nominal: number) => {
    const nextAmount = amount + nominal;
    setAmount(nextAmount);
    setRawInput(String(nextAmount));
    playCoinSound(isMuted);
  };

  const handleQuickSet = (nominal: number) => {
    setAmount(nominal);
    setRawInput(String(nominal));
    playCoinSound(isMuted);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    const num = val ? parseInt(val, 10) : 0;
    setRawInput(val);
    setAmount(num);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    const willAchieveTarget =
      celengan.targetAmount > 0 &&
      currentBalance < celengan.targetAmount &&
      currentBalance + amount >= celengan.targetAmount;

    if (willAchieveTarget) {
      playCelebrationSound(isMuted);
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } else {
      playCoinSound(isMuted);
    }

    onDeposit(amount, note.trim() || 'Menabung ke ' + celengan.name, category);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration bar */}
        <div className="h-2 bg-emerald-500 absolute top-0 left-0 right-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900 leading-tight">
                Masukkan Uang
              </h3>
              <p className="text-xs text-stone-500">
                Isi celengan <span className="font-semibold text-stone-700">{celengan.name}</span>
              </p>
            </div>
          </div>

          <button
            id="btn-close-deposit-modal"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Nominal Input with Big Live Rupiah Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Nominal Setoran
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-bold text-xl text-stone-500">
                Rp
              </span>
              <input
                id="input-deposit-amount"
                type="text"
                inputMode="numeric"
                value={rawInput ? Number(rawInput).toLocaleString('id-ID') : ''}
                onChange={handleInputChange}
                placeholder="0"
                autoFocus
                className="w-full pl-14 pr-4 py-3 text-2xl font-black text-stone-900 bg-stone-50 rounded-2xl border-2 border-emerald-500/50 focus:border-emerald-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Quick Nominal Chips */}
          <div>
            <span className="text-xs font-semibold text-stone-500 block mb-2">
              Pilihan Cepat Nominal:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  id={`btn-quick-amount-${amt}`}
                  onClick={() => handleQuickSet(amt)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center ${
                    amount === amt
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-emerald-50 hover:border-emerald-300'
                  }`}
                >
                  {formatRupiah(amt, true)}
                </button>
              ))}
              <button
                type="button"
                id="btn-add-10k"
                onClick={() => handleQuickAdd(10000)}
                className="py-2 px-1 text-xs font-semibold rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all text-center"
              >
                +10rb
              </button>
            </div>
          </div>

          {/* Sumber / Kategori Uang */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-stone-500" />
              Sumber / Kategori
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                    category === cat
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Catatan Tambahan */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              Catatan (Opsional)
            </label>
            <input
              id="input-deposit-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Sisihan kopi, kembalian martabak"
              className="w-full px-3.5 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Impact preview */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-xs text-emerald-900 flex items-center justify-between">
            <span>Saldo setelah nabung:</span>
            <span className="font-bold text-sm text-emerald-800">
              {formatRupiah(currentBalance + (amount || 0))}
            </span>
          </div>

          {/* Submit Button */}
          <button
            id="btn-confirm-deposit"
            type="submit"
            disabled={amount <= 0}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Masukkan ke Celengan ({formatRupiah(amount)})</span>
          </button>
        </form>
      </div>
    </div>
  );
};
