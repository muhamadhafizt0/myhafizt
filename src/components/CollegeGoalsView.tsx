import React, { useState } from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Award, 
  Laptop, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Sparkles,
  Trash2,
  X,
  PiggyBank
} from 'lucide-react';
import { CollegeGoalItem, Celengan } from '../types';
import { formatRupiah, formatRelativeDays } from '../utils/formatters';

interface CollegeGoalsViewProps {
  goals: CollegeGoalItem[];
  onUpdateGoal: (updated: CollegeGoalItem) => void;
  onAddGoal: (newGoal: CollegeGoalItem) => void;
  onDeleteGoal: (id: string) => void;
  onConvertToCelengan: (goal: CollegeGoalItem) => void;
  onSwitchToCelenganTab: () => void;
}

export const CollegeGoalsView: React.FC<CollegeGoalsViewProps> = ({
  goals,
  onUpdateGoal,
  onAddGoal,
  onDeleteGoal,
  onConvertToCelengan,
  onSwitchToCelenganTab,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [depositModalGoal, setDepositModalGoal] = useState<CollegeGoalItem | null>(null);
  const [depositInput, setDepositInput] = useState<string>('');

  // Form state for new goal
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CollegeGoalItem['category']>('ukt');
  const [newTargetAmount, setNewTargetAmount] = useState('3000000');
  const [newDeadline, setNewDeadline] = useState(
    new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [newSemester, setNewSemester] = useState<number>(6);
  const [newNotes, setNewNotes] = useState('');

  const filteredGoals = goals.filter((g) => {
    if (selectedSemester === 'all') return true;
    return g.semester === selectedSemester;
  });

  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const overallPercentage = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const getCategoryIcon = (cat: CollegeGoalItem['category']) => {
    switch (cat) {
      case 'ukt':
        return <GraduationCap className="w-5 h-5 text-emerald-600" />;
      case 'magang':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'skripsi':
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'sertifikasi':
        return <Award className="w-5 h-5 text-purple-600" />;
      case 'laptop':
        return <Laptop className="w-5 h-5 text-sky-600" />;
      default:
        return <GraduationCap className="w-5 h-5 text-stone-600" />;
    }
  };

  const getCategoryBadge = (cat: CollegeGoalItem['category']) => {
    switch (cat) {
      case 'ukt':
        return { label: 'UKT / SPP', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'magang':
        return { label: 'Magang / PKL', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'skripsi':
        return { label: 'Skripsi & Sempro', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'sertifikasi':
        return { label: 'Sertifikasi / TOEFL', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'laptop':
        return { label: 'Perangkat Kuliah', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
      default:
        return { label: 'Biaya Kuliah', bg: 'bg-stone-50 text-stone-700 border-stone-200' };
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(newTargetAmount.replace(/\D/g, ''), 10) || 0;
    if (!newTitle.trim() || amount <= 0) return;

    const item: CollegeGoalItem = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      targetAmount: amount,
      currentAmount: 0,
      deadlineDate: newDeadline,
      semester: newSemester,
      notes: newNotes.trim(),
    };

    onAddGoal(item);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewNotes('');
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalGoal) return;
    const addedAmount = parseInt(depositInput.replace(/\D/g, ''), 10) || 0;
    if (addedAmount <= 0) return;

    onUpdateGoal({
      ...depositModalGoal,
      currentAmount: depositModalGoal.currentAmount + addedAmount,
    });

    setDepositModalGoal(null);
    setDepositInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Teknik Informatika • Universitas Kuningan (UNIKU)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Rencana & Dana Kuliah UNIKU
            </h2>
            <p className="text-emerald-100 text-sm mt-1.5 leading-relaxed">
              Persiapkan biaya perkuliahan: UKT Semester 6, Dana KP/Magang, Sertifikasi IT BNSP/Cisco, hingga Skripsi Teknik Informatika UNIKU agar lulus tepat waktu.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 min-w-[220px]">
            <span className="text-xs text-emerald-200 font-semibold uppercase tracking-wider block">
              Total Target Terkumpul
            </span>
            <div className="text-2xl font-black text-white mt-1 tabular-nums">
              {formatRupiah(totalSaved)}
            </div>
            <div className="flex items-center justify-between text-xs text-emerald-100 mt-2">
              <span>dari {formatRupiah(totalTarget)}</span>
              <span className="font-bold">{overallPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter and Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Semester Filter Tabs */}
        <div className="flex items-center p-1 bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-x-auto">
          <button
            onClick={() => setSelectedSemester('all')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedSemester === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semua Target ({goals.length})
          </button>
          <button
            onClick={() => setSelectedSemester(5)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedSemester === 5
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semester 5 (Sekarang)
          </button>
          <button
            onClick={() => setSelectedSemester(6)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedSemester === 6
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semester 6
          </button>
          <button
            onClick={() => setSelectedSemester(7)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedSemester === 7
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semester 7/8 (Akhir)
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Target Kuliah</span>
        </button>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.map((goal) => {
          const badge = getCategoryBadge(goal.category);
          const percent = goal.targetAmount > 0
            ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
            : 0;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          // Calculate daily savings needed
          const now = new Date();
          const target = new Date(goal.deadlineDate);
          const diffDays = Math.max(1, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
          const neededPerDay = Math.ceil(remaining / diffDays);

          return (
            <div
              key={goal.id}
              className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all group"
            >
              <div>
                {/* Header card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center justify-center shrink-0">
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.bg}`}>
                        {badge.label} • Semester {goal.semester}
                      </span>
                      <h4 className="font-extrabold text-stone-900 text-base mt-1">
                        {goal.title}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus rencana "${goal.title}"?`)) {
                        onDeleteGoal(goal.id);
                      }
                    }}
                    title="Hapus rencana ini"
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {goal.notes && (
                  <p className="text-xs text-stone-500 mt-2 line-clamp-2">
                    {goal.notes}
                  </p>
                )}

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-stone-400 block">Terkumpul</span>
                      <span className="text-base font-black text-emerald-700 tabular-nums">
                        {formatRupiah(goal.currentAmount)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-stone-400 block">Target</span>
                      <span className="text-xs font-bold text-stone-700 tabular-nums">
                        {formatRupiah(goal.targetAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-stone-100 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 100 ? 'bg-emerald-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2">
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                      {percent}% tercapai
                    </span>
                    <span className="flex items-center gap-1 text-stone-400">
                      <Clock className="w-3 h-3" />
                      {formatRelativeDays(goal.deadlineDate)}
                    </span>
                  </div>
                </div>

                {/* Simulation insight */}
                {remaining > 0 ? (
                  <div className="mt-3 p-2.5 rounded-2xl bg-stone-50 border border-stone-100 text-[11px] text-stone-600 flex items-center justify-between">
                    <span>Nabung harian yang disarankan:</span>
                    <span className="font-extrabold text-stone-900 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                      {formatRupiah(neededPerDay)} / hari
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Alhamdulillah! Target dana ini sudah terpenuhi 100%</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    setDepositModalGoal(goal);
                    setDepositInput('');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  + Tambah Tabungan
                </button>
                <button
                  onClick={() => onConvertToCelengan(goal)}
                  title="Buat celengan khusus target ini di tab Celengan"
                  className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <PiggyBank className="w-3.5 h-3.5" />
                  <span>Jadikan Celengan</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Deposit Modal for Goal */}
      {depositModalGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-stone-900 text-base">
                Tambah Simpanan
              </h3>
              <button
                onClick={() => setDepositModalGoal(null)}
                className="p-1 rounded-xl hover:bg-stone-100 text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-500 mt-2">
              Menambah saldo khusus untuk: <strong className="text-stone-800">{depositModalGoal.title}</strong>
            </p>

            <form onSubmit={handleDepositSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nominal Simpanan (Rp)
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="Misal: 100.000"
                  value={depositInput ? formatRupiah(parseInt(depositInput.replace(/\D/g, '') || '0', 10)) : ''}
                  onChange={(e) => setDepositInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-extrabold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[50000, 100000, 250000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositInput(String(amt))}
                    className="py-1.5 text-xs font-bold rounded-lg border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-700 cursor-pointer transition-all"
                  >
                    +{formatRupiah(amt)}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDepositModalGoal(null)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span>Tambah Target Kuliah</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl hover:bg-stone-100 text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nama Target
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Biaya Cetak Skripsi & Hardcover"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CollegeGoalItem['category'])}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="ukt">UKT / SPP</option>
                    <option value="magang">Magang / PKL</option>
                    <option value="skripsi">Skripsi & Riset</option>
                    <option value="sertifikasi">Sertifikasi & Kursus</option>
                    <option value="laptop">Perangkat / Laptop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Untuk Semester
                  </label>
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value={5}>Semester 5 (Sekarang)</option>
                    <option value={6}>Semester 6</option>
                    <option value={7}>Semester 7</option>
                    <option value={8}>Semester 8</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Target Biaya (Rp)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 2.000.000"
                    value={newTargetAmount ? formatRupiah(parseInt(newTargetAmount.replace(/\D/g, '') || '0', 10)) : ''}
                    onChange={(e) => setNewTargetAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Target Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan rincian atau pos biaya..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Simpan Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
