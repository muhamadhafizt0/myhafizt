import React, { useState } from 'react';
import { X, MinusCircle, AlertTriangle, Hammer, ArrowRight } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { playWithdrawSound } from '../utils/audio';
import { Celengan } from '../types';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  celengan: Celengan;
  currentBalance: number;
  isMuted: boolean;
  onWithdraw: (amount: number, note: string, category: string) => void;
}

const WITHDRAW_REASONS = [
  'Target Tercapai',
  'Kebutuhan Mendesak',
  'Beli Barang Impian',
  'Pindah ke Rekening Lain',
  'Pengeluaran Terencana',
  'Lainnya',
];

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  celengan,
  currentBalance,
  isMuted,
  onWithdraw,
}) => {
  const [mode, setMode] = useState<'partial' | 'break'>('partial');
  const [amount, setAmount] = useState<number>(Math.min(currentBalance, 50000));
  const [rawInput, setRawInput] = useState<string>(String(Math.min(currentBalance, 50000)));
  const [note, setNote] = useState<string>('');
  const [reason, setReason] = useState<string>('Beli Barang Impian');
  const [confirmedLocked, setConfirmedLocked] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    const num = val ? parseInt(val, 10) : 0;
    const clamped = Math.min(num, currentBalance);
    setRawInput(val ? String(clamped) : '');
    setAmount(clamped);
  };

  const handleSetMax = () => {
    setAmount(currentBalance);
    setRawInput(String(currentBalance));
  };

  const handleSetHalf = () => {
    const half = Math.floor(currentBalance / 2);
    setAmount(half);
    setRawInput(String(half));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = mode === 'break' ? currentBalance : amount;
    if (finalAmount <= 0) return;
    if (finalAmount > currentBalance) return;

    if (celengan.isLocked && !confirmedLocked) {
      return;
    }

    playWithdrawSound(isMuted);

    const fullNote = mode === 'break' 
      ? `Pecahkan celengan: ${note.trim() || 'Ambil semua tabungan'}` 
      : (note.trim() || `Tarik tabungan untuk ${reason}`);

    onWithdraw(finalAmount, fullNote, reason);
    onClose();
  };

  const effectiveAmount = mode === 'break' ? currentBalance : amount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top decoration */}
        <div className="h-2 bg-rose-500 absolute top-0 left-0 right-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              {mode === 'break' ? <Hammer className="w-5 h-5" /> : <MinusCircle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900 leading-tight">
                {mode === 'break' ? 'Pecahkan Celengan' : 'Ambil Uang Tabungan'}
              </h3>
              <p className="text-xs text-stone-500">
                Saldo tersedia: <strong className="text-stone-800">{formatRupiah(currentBalance)}</strong>
              </p>
            </div>
          </div>

          <button
            id="btn-close-withdraw-modal"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('partial')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'partial'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Tarik Sebagian
          </button>
          <button
            type="button"
            onClick={() => setMode('break')}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mode === 'break'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            Pecahkan Celengan
          </button>
        </div>

        {/* Lock warning if celengan has locked status */}
        {celengan.isLocked && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Celengan ini berstatus Terkunci!</p>
              <label className="flex items-center gap-2 mt-1.5 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedLocked}
                  onChange={(e) => setConfirmedLocked(e.target.checked)}
                  className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                />
                <span>Saya tetap ingin membuka/menarik dana sekarang</span>
              </label>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {mode === 'partial' ? (
            <>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    Nominal Penarikan
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSetHalf}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      50% (Setengah)
                    </button>
                    <span className="text-stone-300">|</span>
                    <button
                      type="button"
                      onClick={handleSetMax}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Semua ({formatRupiah(currentBalance, true)})
                    </button>
                  </div>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-bold text-xl text-stone-500">
                    Rp
                  </span>
                  <input
                    id="input-withdraw-amount"
                    type="text"
                    inputMode="numeric"
                    value={rawInput ? Number(rawInput).toLocaleString('id-ID') : ''}
                    onChange={handleInputChange}
                    placeholder="0"
                    autoFocus
                    className="w-full pl-14 pr-4 py-3 text-2xl font-black text-stone-900 bg-stone-50 rounded-2xl border-2 border-rose-400/50 focus:border-rose-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
                {amount > currentBalance && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    Nominal melebihi saldo tabungan!
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Hammer className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-base">
                Pecahkan dan Ambil Semua Saldo
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                Semua uang di celengan ({formatRupiah(currentBalance)}) akan ditarik sekaligus.
              </p>
            </div>
          )}

          {/* Keperluan / Alasan */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 block">
              Tujuan Penggunaan
            </label>
            <div className="flex flex-wrap gap-1.5">
              {WITHDRAW_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                    reason === r
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1 block">
              Catatan Penarikan (Opsional)
            </label>
            <input
              id="input-withdraw-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Beli tiket kereta mudik / bayar servis"
              className="w-full px-3.5 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Summary Balance */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs flex items-center justify-between">
            <span className="text-stone-500">Sisa saldo nanti:</span>
            <span className="font-bold text-stone-900 text-sm">
              {formatRupiah(Math.max(0, currentBalance - effectiveAmount))}
            </span>
          </div>

          {/* Submit button */}
          <button
            id="btn-confirm-withdraw"
            type="submit"
            disabled={
              effectiveAmount <= 0 ||
              effectiveAmount > currentBalance ||
              (celengan.isLocked && !confirmedLocked)
            }
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {mode === 'break'
                ? `Pecahkan Celengan (${formatRupiah(currentBalance)})`
                : `Ambil Uang (${formatRupiah(effectiveAmount)})`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
