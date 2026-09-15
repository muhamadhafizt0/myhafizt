import React, { useState } from 'react';
import { X, Target, Calendar, Lock, Palette } from 'lucide-react';
import { Celengan } from '../types';
import { formatRupiah } from '../utils/formatters';

interface EditTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  celengan: Celengan;
  onSave: (updated: Partial<Celengan>) => void;
}

const COLOR_OPTIONS: Array<{ id: Celengan['color']; label: string; class: string }> = [
  { id: 'emerald', label: 'Hijau Segar', class: 'bg-emerald-500' },
  { id: 'amber', label: 'Kuning Emas', class: 'bg-amber-500' },
  { id: 'rose', label: 'Merah Muda', class: 'bg-rose-500' },
  { id: 'sky', label: 'Biru Langit', class: 'bg-sky-500' },
  { id: 'indigo', label: 'Ungu Indigo', class: 'bg-indigo-500' },
];

export const EditTargetModal: React.FC<EditTargetModalProps> = ({
  isOpen,
  onClose,
  celengan,
  onSave,
}) => {
  const [name, setName] = useState(celengan.name);
  const [targetTitle, setTargetTitle] = useState(celengan.targetTitle);
  const [targetAmount, setTargetAmount] = useState(celengan.targetAmount);
  const [rawAmount, setRawAmount] = useState(String(celengan.targetAmount));
  const [targetDate, setTargetDate] = useState(celengan.targetDate || '');
  const [color, setColor] = useState<Celengan['color']>(celengan.color);
  const [isLocked, setIsLocked] = useState<boolean>(Boolean(celengan.isLocked));

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

    onSave({
      name: name.trim(),
      targetTitle: targetTitle.trim() || 'Target Tabungan',
      targetAmount,
      targetDate: targetDate || undefined,
      color,
      isLocked,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900 leading-tight">
                Pengaturan Celengan
              </h3>
              <p className="text-xs text-stone-500">
                Atur nama celengan, nominal target, dan tenggat waktu
              </p>
            </div>
          </div>

          <button
            id="btn-close-edit-target"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Nama Celengan */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Nama Celengan
            </label>
            <input
              id="input-edit-celengan-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tabunganku"
              className="w-full px-3.5 py-2.5 text-sm font-semibold bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white transition-colors"
            />
          </div>

          {/* Judul Impian / Sasaran Target */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Tujuan Menabung
            </label>
            <input
              id="input-edit-target-title"
              type="text"
              value={targetTitle}
              onChange={(e) => setTargetTitle(e.target.value)}
              placeholder="Contoh: Beli Laptop Baru, Liburan Akhir Tahun"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white transition-colors"
            />
          </div>

          {/* Nominal Target */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Nominal Target
              </label>
              <span className="text-xs font-bold text-amber-700">
                {formatRupiah(targetAmount)}
              </span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-bold text-lg text-stone-400">
                Rp
              </span>
              <input
                id="input-edit-target-amount"
                type="text"
                inputMode="numeric"
                value={rawAmount ? Number(rawAmount).toLocaleString('id-ID') : ''}
                onChange={handleAmountChange}
                placeholder="1.000.000"
                className="w-full pl-14 pr-4 py-2.5 text-lg font-bold text-stone-900 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Tenggat Waktu (Target Date) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              Target Tercapai Sebelum (Opsional)
            </label>
            <input
              id="input-edit-target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white transition-colors"
            />
          </div>

          {/* Pilihan Warna Celengan */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-stone-500" />
              Warna Tema Celengan
            </label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  title={c.label}
                  className={`w-9 h-9 rounded-xl ${c.class} flex items-center justify-center transition-all ${
                    color === c.id ? 'ring-3 ring-stone-900 ring-offset-2 scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Opsi Kunci Celengan */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${isLocked ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-600'}`}>
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 block">
                  Kunci Celengan
                </span>
                <span className="text-[11px] text-stone-500">
                  Melatih disiplin agar tidak mudah ditarik
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="toggle-lock-celengan"
                type="checkbox"
                checked={isLocked}
                onChange={(e) => setIsLocked(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {/* Tombol Simpan */}
          <div className="pt-2">
            <button
              id="btn-save-target-settings"
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
