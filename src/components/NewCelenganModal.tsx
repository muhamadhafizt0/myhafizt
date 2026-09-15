import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { Celengan } from '../types';
import { formatRupiah } from '../utils/formatters';

interface NewCelenganModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newCelengan: Celengan) => void;
}

export const NewCelenganModal: React.FC<NewCelenganModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('Tabunganku 2');
  const [targetTitle, setTargetTitle] = useState('Beli Sepatu Baru');
  const [targetAmount, setTargetAmount] = useState<number>(1000000);
  const [rawAmount, setRawAmount] = useState<string>('1000000');
  const [targetDate, setTargetDate] = useState<string>('');
  const [color, setColor] = useState<Celengan['color']>('sky');

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    const num = val ? parseInt(val, 10) : 0;
    setRawAmount(val);
    setTargetAmount(num);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || targetAmount <= 0) return;

    const newCelengan: Celengan = {
      id: `celengan-${Date.now()}`,
      name: name.trim(),
      targetTitle: targetTitle.trim() || 'Target Tabungan',
      targetAmount,
      targetDate: targetDate || undefined,
      color,
      icon: 'piggy',
      createdAt: new Date().toISOString(),
    };

    onCreate(newCelengan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900 leading-tight">
                Buat Celengan Baru
              </h3>
              <p className="text-xs text-stone-500">
                Tambah wadah tabungan terpisah untuk impianmu
              </p>
            </div>
          </div>

          <button
            id="btn-close-new-celengan"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Nama Celengan
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Tabunganku - Gadget"
              className="w-full px-3.5 py-2.5 text-sm font-semibold bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Target Impian
            </label>
            <input
              type="text"
              value={targetTitle}
              onChange={(e) => setTargetTitle(e.target.value)}
              placeholder="Contoh: Beli Tiket Konser, Servis Motor"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Nominal Target
              </label>
              <span className="text-xs font-bold text-sky-700">
                {formatRupiah(targetAmount)}
              </span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-bold text-lg text-stone-400">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={rawAmount ? Number(rawAmount).toLocaleString('id-ID') : ''}
                onChange={handleAmountChange}
                placeholder="1.000.000"
                className="w-full pl-14 pr-4 py-2.5 text-lg font-bold text-stone-900 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Tenggat Waktu (Opsional)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2 block">
              Pilih Warna Celengan
            </label>
            <div className="flex gap-2">
              {(['emerald', 'amber', 'rose', 'sky', 'indigo'] as const).map((c) => {
                const colors = {
                  emerald: 'bg-emerald-500',
                  amber: 'bg-amber-500',
                  rose: 'bg-rose-500',
                  sky: 'bg-sky-500',
                  indigo: 'bg-indigo-500',
                };
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-9 h-9 rounded-xl ${colors[c]} transition-all ${
                      color === c ? 'ring-3 ring-stone-900 ring-offset-2 scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-all mt-4 cursor-pointer"
          >
            Buat Celengan Sekarang
          </button>
        </form>
      </div>
    </div>
  );
};
