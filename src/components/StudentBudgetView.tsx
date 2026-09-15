import React, { useState } from 'react';
import { 
  Wallet, 
  Home, 
  Wifi, 
  Bus, 
  FileText, 
  Coffee, 
  PiggyBank, 
  Utensils, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { StudentBudgetData } from '../types';
import { formatRupiah } from '../utils/formatters';

interface StudentBudgetViewProps {
  budget: StudentBudgetData;
  onSaveBudget: (budget: StudentBudgetData) => void;
  onSwitchToCelenganTab: () => void;
}

export const StudentBudgetView: React.FC<StudentBudgetViewProps> = ({
  budget,
  onSaveBudget,
  onSwitchToCelenganTab,
}) => {
  const [formData, setFormData] = useState<StudentBudgetData>(budget);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Calculations
  const totalFixedExpenses =
    formData.kosRent +
    formData.wifiAndBills +
    formData.transportMonthly +
    formData.collegeSupplies;

  const totalCommitted =
    totalFixedExpenses + formData.hangoutBudget + formData.savingsMonthly;

  const remainingForFood = formData.monthlyAllowance - totalCommitted;
  const dailyFoodBudget = Math.floor(remainingForFood / 30);

  const handleNumericChange = (key: keyof StudentBudgetData, rawValue: string) => {
    const num = parseInt(rawValue.replace(/\D/g, ''), 10) || 0;
    setFormData((prev) => ({ ...prev, [key]: num }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBudget(formData);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleResetToStandard = () => {
    if (window.confirm('Kembalikan anggaran ke standar mahasiswa UNIKU (Rp 2.000.000 / bulan)?')) {
      const standard: StudentBudgetData = {
        monthlyAllowance: 2000000,
        kosRent: 600000,
        wifiAndBills: 100000,
        transportMonthly: 150000,
        collegeSupplies: 100000,
        hangoutBudget: 200000,
        savingsMonthly: 250000,
      };
      setFormData(standard);
      onSaveBudget(standard);
    }
  };

  // Status check for daily food
  const getFoodStatus = () => {
    if (dailyFoodBudget <= 0) {
      return {
        badge: 'Defisit / Boncos!',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        desc: 'Pengeluaran melebihi uang bulanan! Kurangi pos nongkrong atau cari kos/gaya hidup lebih hemat.',
        icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
      };
    } else if (dailyFoodBudget < 25000) {
      return {
        badge: 'Ketat (Perlu Berhemat)',
        color: 'bg-amber-50 text-amber-800 border-amber-200',
        desc: 'Jatah makan di bawah Rp 25.000/hari. Disarankan masak nasi sendiri di kos dan beli lauk matang di warteg.',
        icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      };
    } else if (dailyFoodBudget <= 45000) {
      return {
        badge: 'Ideal Mahasiswa',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        desc: 'Cukup untuk makan 2-3x sehari di warteg/kantin kampus dengan gizi standar anak kuliahan.',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      };
    } else {
      return {
        badge: 'Leluasa & Nyaman',
        color: 'bg-blue-50 text-blue-800 border-blue-200',
        desc: 'Jatah makan sangat cukup dan aman. Bisa lebih banyak dialihkan ke tabungan celengan masa depan.',
        icon: <Sparkles className="w-4 h-4 text-blue-600" />,
      };
    }
  };

  const foodStatus = getFoodStatus();

  return (
    <div className="space-y-6">
      {/* Overview Top Metric */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Allowance Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
            <span>Uang Bulanan (Total Saku)</span>
            <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2 tabular-nums">
            {formatRupiah(formData.monthlyAllowance)}
          </div>
          <p className="text-xs text-stone-400 mt-1">Kiriman orang tua / gaji sampingan</p>
        </div>

        {/* Daily Food Budget - THE HERO METRIC FOR STUDENTS */}
        <div className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white rounded-3xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-emerald-200 font-semibold">
            <span>Jatah Makan Aman / Hari</span>
            <div className="p-1.5 rounded-xl bg-white/20 text-white">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2 tabular-nums">
            {dailyFoodBudget > 0 ? `${formatRupiah(dailyFoodBudget)}` : 'Rp 0 (Defisit)'}
            <span className="text-xs font-normal text-emerald-200 ml-1">/ hari</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-100">
            <span>Total bulanan makan: {formatRupiah(Math.max(0, remainingForFood))}</span>
          </div>
        </div>

        {/* Monthly Savings Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
            <span>Alokasi Nabung ke Celengan</span>
            <div className="p-1.5 rounded-xl bg-amber-50 text-amber-700">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2 tabular-nums">
            {formatRupiah(formData.savingsMonthly)}
          </div>
          <button
            onClick={onSwitchToCelenganTab}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-bold mt-1 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Celengan Utama &rarr;</span>
          </button>
        </div>
      </div>

      {/* Food Status Callout */}
      <div className={`p-4 rounded-3xl border flex items-start gap-3.5 ${foodStatus.color}`}>
        <div className="p-2 rounded-2xl bg-white/80 shrink-0 shadow-2xs">
          {foodStatus.icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm">Status Anggaran Makan:</span>
            <span className="font-extrabold text-xs px-2 py-0.5 rounded-md bg-white/60">
              {foodStatus.badge}
            </span>
          </div>
          <p className="text-xs mt-1 leading-relaxed">
            {foodStatus.desc}
          </p>
        </div>
      </div>

      {/* Main Budget Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <h3 className="font-extrabold text-stone-900 text-lg">
              Kalkulator Pos Keuangan Mahasiswa
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Sesuaikan pengeluaran kos, kuliah, dan jajan agar uang bulanan tidak habis di tengah jalan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToStandard}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Standar Kos</span>
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Anggaran</span>
            </button>
          </div>
        </div>

        {isSavedToast && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Anggaran berhasil diperbarui dan disimpan di perangkat Anda!</span>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sisi Kiri: Pendapatan & Biaya Tetap Kos */}
          <div className="space-y-4">
            <div className="font-extrabold text-xs uppercase tracking-wider text-stone-400">
              1. Pemasukan & Biaya Wajib
            </div>

            {/* Total Uang Saku */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-stone-800 mb-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>Uang Saku / Kiriman / Penghasilan Bulanan (Rp)</span>
              </label>
              <input
                type="text"
                value={formatRupiah(formData.monthlyAllowance)}
                onChange={(e) => handleNumericChange('monthlyAllowance', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-black bg-stone-50 border border-stone-300 rounded-2xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* Sewa Kos */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-stone-800 mb-1.5">
                <Home className="w-4 h-4 text-blue-600" />
                <span>Sewa Kos Bulanan (Rp)</span>
              </label>
              <input
                type="text"
                value={formatRupiah(formData.kosRent)}
                onChange={(e) => handleNumericChange('kosRent', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">Isi 0 jika tinggal bersama orang tua</span>
            </div>

            {/* WiFi & Kuota */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-stone-800 mb-1.5">
                <Wifi className="w-4 h-4 text-indigo-600" />
                <span>Paket Data / Iuran WiFi Kos (Rp)</span>
              </label>
              <input
                type="text"
                value={formatRupiah(formData.wifiAndBills)}
                onChange={(e) => handleNumericChange('wifiAndBills', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* Transport */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-stone-800 mb-1.5">
                <Bus className="w-4 h-4 text-amber-600" />
                <span>Bensin Motor / Ongkos Angkot ke Kampus (Rp)</span>
              </label>
              <input
                type="text"
                value={formatRupiah(formData.transportMonthly)}
                onChange={(e) => handleNumericChange('transportMonthly', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Sisi Kanan: Kebutuhan Kuliah, Tabungan & Nongkrong */}
          <div className="space-y-4">
            <div className="font-extrabold text-xs uppercase tracking-wider text-stone-400">
              2. Kebutuhan Kuliah, Tabungan & Santai
            </div>

            {/* Tugas & Fotokopi */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-stone-800 mb-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Biaya Print Tugas, Fotokopi & Alat Tulis (Rp)</span>
              </label>
              <input
                type="text"
                value={formatRupiah(formData.collegeSupplies)}
                onChange={(e) => handleNumericChange('collegeSupplies', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">Semester 5 biasanya mulai banyak tugas laporan & makalah</span>
            </div>

            {/* Tabungan Celengan */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-stone-800 mb-1.5">
                <PiggyBank className="w-4 h-4 text-emerald-600" />
                <span>Target Disimpan ke Celengan (Rp)</span>
              </label>
              <input
                type="text"
                value={formatRupiah(formData.savingsMonthly)}
                onChange={(e) => handleNumericChange('savingsMonthly', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                Disisihkan di awal bulan agar tidak terpakai jajan
              </span>
            </div>

            {/* Nongkrong / Nugas Cafe */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-stone-800 mb-1.5">
                <Coffee className="w-4 h-4 text-amber-700" />
                <span>Jatah Nongkrong & Nugas di Cafe (Rp)</span>
              </label>
              <input
                type="text"
                value={formatRupiah(formData.hangoutBudget)}
                onChange={(e) => handleNumericChange('hangoutBudget', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">Maksimal pengeluaran ngopi per bulan</span>
            </div>
          </div>
        </div>

        {/* Ringkasan Breakdown Visual */}
        <div className="mt-8 pt-5 border-t border-stone-100">
          <h4 className="text-xs font-bold text-stone-600 mb-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Alokasi Total Pengeluaran Anda:</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Biaya Kos & Wajib</span>
              <span className="text-sm font-extrabold text-stone-900 tabular-nums block mt-0.5">
                {formatRupiah(totalFixedExpenses)}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Makan 30 Hari</span>
              <span className="text-sm font-extrabold text-emerald-800 tabular-nums block mt-0.5">
                {formatRupiah(Math.max(0, remainingForFood))}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Celengan Tabungan</span>
              <span className="text-sm font-extrabold text-amber-700 tabular-nums block mt-0.5">
                {formatRupiah(formData.savingsMonthly)}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Santai / Ngopi</span>
              <span className="text-sm font-extrabold text-stone-700 tabular-nums block mt-0.5">
                {formatRupiah(formData.hangoutBudget)}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
