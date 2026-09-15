import React from 'react';
import { TrendingUp, Calendar, Zap, Award, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Celengan, Transaction } from '../types';
import { formatRupiah, formatRelativeDays } from '../utils/formatters';

interface CelenganStatsProps {
  celengan: Celengan;
  transactions: Transaction[];
  currentBalance: number;
}

export const CelenganStats: React.FC<CelenganStatsProps> = ({
  celengan,
  transactions,
  currentBalance,
}) => {
  const totalIn = transactions
    .filter((t) => t.type === 'in')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = transactions
    .filter((t) => t.type === 'out')
    .reduce((sum, t) => sum + t.amount, 0);

  const countIn = transactions.filter((t) => t.type === 'in').length;
  const remaining = Math.max(0, celengan.targetAmount - currentBalance);

  // Daily savings recommendation if target date is set
  let daysLeft: number | null = null;
  let dailyRecommendation: number | null = null;
  let weeklyRecommendation: number | null = null;

  if (celengan.targetDate) {
    const target = new Date(celengan.targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft > 0 && remaining > 0) {
      dailyRecommendation = Math.ceil(remaining / daysLeft);
      weeklyRecommendation = Math.ceil(remaining / Math.max(1, daysLeft / 7));
    }
  }

  // Savings streak or consistency
  const averageDeposit = countIn > 0 ? Math.round(totalIn / countIn) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Total Ditabung */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold">
          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
          <span>Total Ditabung</span>
        </div>
        <p className="text-base sm:text-lg font-black text-stone-900 mt-1 tabular-nums">
          {formatRupiah(totalIn, true)}
        </p>
        <p className="text-[11px] text-stone-400 mt-0.5 font-medium">
          {countIn} kali setor
        </p>
      </div>

      {/* Total Ditarik */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold">
          <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
          <span>Total Ditarik</span>
        </div>
        <p className="text-base sm:text-lg font-black text-stone-900 mt-1 tabular-nums">
          {formatRupiah(totalOut, true)}
        </p>
        <p className="text-[11px] text-stone-400 mt-0.5 font-medium">
          Pengeluaran tabungan
        </p>
      </div>

      {/* Rata-rata Sekali Nabung */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          <span>Rata-rata Setor</span>
        </div>
        <p className="text-base sm:text-lg font-black text-stone-900 mt-1 tabular-nums">
          {formatRupiah(averageDeposit, true)}
        </p>
        <p className="text-[11px] text-stone-400 mt-0.5 font-medium">
          Konsistensi menabung
        </p>
      </div>

      {/* Rekomendasi / Target Countdown */}
      <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/70 shadow-2xs">
        <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          <span>{celengan.targetDate ? 'Rekomendasi' : 'Sisa Target'}</span>
        </div>
        {dailyRecommendation && daysLeft && daysLeft > 0 ? (
          <>
            <p className="text-base sm:text-lg font-black text-emerald-950 mt-1 tabular-nums">
              {formatRupiah(dailyRecommendation, true)}
              <span className="text-[10px] font-normal text-emerald-700"> /hari</span>
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
              Sisa {daysLeft} hari lagi
            </p>
          </>
        ) : remaining === 0 ? (
          <>
            <p className="text-base sm:text-lg font-black text-emerald-950 mt-1">
              Lunas 100%!
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
              Target tercapai hebat!
            </p>
          </>
        ) : (
          <>
            <p className="text-base sm:text-lg font-black text-emerald-950 mt-1 tabular-nums">
              {formatRupiah(remaining, true)}
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
              Menuju target penuh
            </p>
          </>
        )}
      </div>
    </div>
  );
};
