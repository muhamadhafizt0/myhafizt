import React, { useState, useEffect, useMemo } from 'react';
import { 
  PiggyBank, 
  Plus, 
  Minus, 
  Settings, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  Calendar, 
  Target, 
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  GraduationCap,
  Wallet,
  BookOpen,
  ClipboardList
} from 'lucide-react';
import { Celengan, Transaction, MainMenuTab, CollegeGoalItem, StudentBudgetData, CourseSchedule, CourseAssignment, StudentProfile } from './types';
import { 
  loadCelenganList, 
  saveCelenganList, 
  loadTransactions, 
  saveTransactions, 
  loadActiveCelenganId, 
  saveActiveCelenganId,
  loadSoundMuted,
  saveSoundMuted,
  DEFAULT_CELENGAN_ID,
  clearAllAppData,
  loadCollegeGoals,
  saveCollegeGoals,
  loadStudentBudget,
  saveStudentBudget,
  loadCourseSchedules,
  saveCourseSchedules,
  loadCourseAssignments,
  saveCourseAssignments,
  loadStudentProfile,
  saveStudentProfile,
  INITIAL_COURSE_SCHEDULES,
  INITIAL_COURSE_ASSIGNMENTS
} from './utils/storage';
import { formatRupiah, formatRelativeDays } from './utils/formatters';
import { PiggyBankVisual } from './components/PiggyBankVisual';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { EditTargetModal } from './components/EditTargetModal';
import { NewCelenganModal } from './components/NewCelenganModal';
import { TransactionHistory } from './components/TransactionHistory';
import { CelenganStats } from './components/CelenganStats';
import { CollegeGoalsView } from './components/CollegeGoalsView';
import { StudentBudgetView } from './components/StudentBudgetView';
import { StudentChallengesView } from './components/StudentChallengesView';
import { CourseScheduleView } from './components/CourseScheduleView';
import { AssignmentsView } from './components/AssignmentsView';
import { StudentProfileModal } from './components/StudentProfileModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainMenuTab>('celengan');
  const [celenganList, setCelenganList] = useState<Celengan[]>(() => loadCelenganList());
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [activeId, setActiveId] = useState<string>(() => loadActiveCelenganId());
  const [isMuted, setIsMuted] = useState<boolean>(() => loadSoundMuted());

  // Semester 5 Mahasiswa State: Target, Budget, Schedules & Assignments
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => loadStudentProfile());
  const [collegeGoals, setCollegeGoals] = useState<CollegeGoalItem[]>(() => loadCollegeGoals());
  const [studentBudget, setStudentBudget] = useState<StudentBudgetData>(() => loadStudentBudget());
  const [schedules, setSchedules] = useState<CourseSchedule[]>(() => loadCourseSchedules());
  const [assignments, setAssignments] = useState<CourseAssignment[]>(() => loadCourseAssignments());

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);
  const [isEditTargetOpen, setIsEditTargetOpen] = useState<boolean>(false);
  const [isNewCelenganOpen, setIsNewCelenganOpen] = useState<boolean>(false);
  const [showCelenganDropdown, setShowCelenganDropdown] = useState<boolean>(false);

  // Trigger coin drop visual animation
  const [coinDropCounter, setCoinDropCounter] = useState<number>(0);

  // Active celengan object
  const activeCelengan = useMemo(() => {
    return (
      celenganList.find((c) => c.id === activeId) ||
      celenganList[0] || {
        id: DEFAULT_CELENGAN_ID,
        name: 'Tabunganku',
        targetTitle: 'Target Tabungan',
        targetAmount: 1000000,
        color: 'emerald',
        icon: 'piggy',
        createdAt: new Date().toISOString(),
      }
    );
  }, [celenganList, activeId]);

  // Filter transactions for active celengan
  const activeTransactions = useMemo(() => {
    return transactions.filter((t) => t.celenganId === activeCelengan.id);
  }, [transactions, activeCelengan.id]);

  // Current balance of active celengan
  const currentBalance = useMemo(() => {
    return activeTransactions.reduce((acc, t) => {
      return t.type === 'in' ? acc + t.amount : acc - t.amount;
    }, 0);
  }, [activeTransactions]);

  // Persist state changes
  useEffect(() => {
    saveCelenganList(celenganList);
  }, [celenganList]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveActiveCelenganId(activeId);
  }, [activeId]);

  useEffect(() => {
    saveSoundMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    saveCollegeGoals(collegeGoals);
  }, [collegeGoals]);

  useEffect(() => {
    saveStudentBudget(studentBudget);
  }, [studentBudget]);

  useEffect(() => {
    saveCourseSchedules(schedules);
  }, [schedules]);

  useEffect(() => {
    saveCourseAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    saveStudentProfile(studentProfile);
  }, [studentProfile]);

  // Handle deposit
  const handleDeposit = (amount: number, note: string, category: string) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      celenganId: activeCelengan.id,
      type: 'in',
      amount,
      date: new Date().toISOString(),
      note,
      category,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setCoinDropCounter((prev) => prev + 1);
  };

  // College Goals Handlers
  const handleAddCollegeGoal = (newGoal: CollegeGoalItem) => {
    setCollegeGoals((prev) => [newGoal, ...prev]);
  };

  const handleUpdateCollegeGoal = (updated: CollegeGoalItem) => {
    setCollegeGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  };

  const handleDeleteCollegeGoal = (id: string) => {
    setCollegeGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleConvertToCelengan = (goal: CollegeGoalItem) => {
    const existing = celenganList.find(
      (c) => c.targetTitle.toLowerCase() === goal.title.toLowerCase() || c.name.toLowerCase() === goal.title.toLowerCase()
    );

    if (existing) {
      setActiveId(existing.id);
      setActiveTab('celengan');
      return;
    }

    const newCelengan: Celengan = {
      id: `celengan-${goal.category}-${Date.now()}`,
      name: goal.title.length > 18 ? goal.title.substring(0, 18) + '...' : goal.title,
      targetTitle: goal.title,
      targetAmount: goal.targetAmount,
      targetDate: goal.deadlineDate,
      color: goal.category === 'ukt' ? 'emerald' : goal.category === 'skripsi' ? 'amber' : 'sky',
      icon: 'graduation',
      createdAt: new Date().toISOString(),
    };

    setCelenganList((prev) => [...prev, newCelengan]);
    setActiveId(newCelengan.id);
    setActiveTab('celengan');
  };

  const handleQuickDepositChallenge = (amount: number, note: string) => {
    handleDeposit(amount, note, 'Tantangan Mahasiswa');
    setActiveTab('celengan');
  };

  const handleSaveStudentBudget = (newBudget: StudentBudgetData) => {
    setStudentBudget(newBudget);
  };

  // Course Schedules Handlers
  const handleAddSchedule = (newSchedule: CourseSchedule) => {
    setSchedules((prev) => [...prev, newSchedule]);
  };
  const handleUpdateSchedule = (updated: CourseSchedule) => {
    setSchedules((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };
  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };
  const handleResetSchedules = () => {
    setSchedules(INITIAL_COURSE_SCHEDULES);
  };

  // Course Assignments Handlers
  const handleAddAssignment = (newAssignment: CourseAssignment) => {
    setAssignments((prev) => [newAssignment, ...prev]);
  };
  const handleUpdateAssignment = (updated: CourseAssignment) => {
    setAssignments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };
  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };
  const handleResetAssignments = () => {
    setAssignments(INITIAL_COURSE_ASSIGNMENTS);
  };

  // Handle withdraw
  const handleWithdraw = (amount: number, note: string, category: string) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      celenganId: activeCelengan.id,
      type: 'out',
      amount,
      date: new Date().toISOString(),
      note,
      category,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Handle update celengan settings
  const handleUpdateCelengan = (updated: Partial<Celengan>) => {
    setCelenganList((prev) =>
      prev.map((c) => (c.id === activeCelengan.id ? { ...c, ...updated } : c))
    );
  };

  // Handle create new celengan
  const handleCreateCelengan = (newC: Celengan) => {
    setCelenganList((prev) => [...prev, newC]);
    setActiveId(newC.id);
  };

  // Handle delete transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle clear transactions for active celengan
  const handleClearHistory = () => {
    if (window.confirm(`Kosongkan semua riwayat transaksi pada celengan "${activeCelengan.name}" dan mulai saldo dari Rp 0?`)) {
      setTransactions((prev) => prev.filter((t) => t.celenganId !== activeCelengan.id));
    }
  };

  // Handle full reset of all data
  const handleResetAllData = () => {
    if (window.confirm('Hapus seluruh riwayat transaksi dan kembalikan celengan ke kondisi awal yang kosong?')) {
      clearAllAppData();
      setTransactions([]);
      setCelenganList([
        {
          id: DEFAULT_CELENGAN_ID,
          name: 'Tabunganku',
          targetTitle: 'Target Impian',
          targetAmount: 1000000,
          color: 'emerald',
          icon: 'piggy',
          createdAt: new Date().toISOString(),
        },
      ]);
      setActiveId(DEFAULT_CELENGAN_ID);
    }
  };

  const daysLeftLabel = formatRelativeDays(activeCelengan.targetDate);
  const isTargetAchieved = activeCelengan.targetAmount > 0 && currentBalance >= activeCelengan.targetAmount;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & App Name & Owner */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <PiggyBank className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-stone-900 block leading-none">
                  Tabunganku
                </span>
                <button
                  id="btn-open-student-card-badge"
                  onClick={() => setIsProfileOpen(true)}
                  title="Buka Kartu Mahasiswa UNIKU"
                  className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors cursor-pointer"
                >
                  <GraduationCap className="w-3 h-3 text-amber-700 shrink-0" />
                  <span className="max-w-[140px] sm:max-w-none truncate">
                    TI • UNIKU (Smst {studentProfile.semester})
                  </span>
                </button>
              </div>
              <button
                id="btn-open-student-card-sub"
                onClick={() => setIsProfileOpen(true)}
                className="text-[11px] text-stone-500 font-medium tracking-wide block mt-0.5 hover:text-emerald-700 transition-colors text-left"
              >
                Mahasiswa: <strong className="text-stone-800 font-bold">{studentProfile.name}</strong>{' '}
                <span className="text-stone-400">({studentProfile.major})</span>
              </button>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            {/* Student ID Card / KTM button */}
            <button
              id="btn-open-ktm"
              onClick={() => setIsProfileOpen(true)}
              title="Buka Kartu Mahasiswa Digital (KTM UNIKU)"
              className="p-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer flex items-center gap-1"
            >
              <GraduationCap className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-bold hidden md:inline">KTM Digital</span>
            </button>

            {/* Celengan Selector Dropdown */}
            <div className="relative">
              <button
                id="btn-select-celengan"
                onClick={() => setShowCelenganDropdown(!showCelenganDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-800 transition-colors"
              >
                <span className="max-w-[110px] sm:max-w-[160px] truncate">
                  {activeCelengan.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              </button>

              {showCelenganDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setShowCelenganDropdown(false)}
                >
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1 block">
                    Daftar Celengan
                  </span>
                  <div className="space-y-1 my-1">
                    {celenganList.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setActiveId(c.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                          c.id === activeCelengan.id
                            ? 'bg-emerald-50 text-emerald-900 font-bold'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        {c.id === activeCelengan.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-stone-100">
                    <button
                      onClick={() => setIsNewCelenganOpen(true)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-800 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Celengan Baru</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              id="btn-toggle-sound"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Suara mati (Klik untuk aktifkan)' : 'Suara aktif (Klik untuk matikan)'}
              className={`p-2 rounded-xl border transition-colors ${
                isMuted
                  ? 'border-stone-200 text-stone-400 hover:bg-stone-100'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Edit Target / Settings */}
            <button
              id="btn-open-settings"
              onClick={() => setIsEditTargetOpen(true)}
              title="Atur target tabungan"
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Sub-Header Navigation Tabs */}
      <nav className="bg-white border-b border-stone-200/80 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between overflow-x-auto gap-2 py-2.5">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              id="tab-celengan"
              onClick={() => setActiveTab('celengan')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'celengan'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <PiggyBank className="w-4 h-4" />
              <span>Celengan</span>
            </button>

            <button
              id="tab-jadwal"
              onClick={() => setActiveTab('jadwal')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'jadwal'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwal Kuliah</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  activeTab === 'jadwal' ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                {schedules.length}
              </span>
            </button>

            <button
              id="tab-tugas"
              onClick={() => setActiveTab('tugas')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tugas'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Tugas & Deadline</span>
              {assignments.filter((a) => a.status !== 'completed').length > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    activeTab === 'tugas' ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {assignments.filter((a) => a.status !== 'completed').length}
                </span>
              )}
            </button>

            <button
              id="tab-kuliah"
              onClick={() => setActiveTab('kuliah')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'kuliah'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Target Kuliah</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  activeTab === 'kuliah' ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {collegeGoals.length}
              </span>
            </button>

            <button
              id="tab-anggaran"
              onClick={() => setActiveTab('anggaran')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'anggaran'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Anggaran Anak Kos</span>
            </button>

            <button
              id="tab-tips"
              onClick={() => setActiveTab('tips')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'tips'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Tantangan Nabung</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
            <span>🎓 Semester 5 Aktif</span>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {activeTab === 'celengan' && (
          <>
            {/* Banner Info Celengan Aktif */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                    {activeCelengan.name}
                  </h1>
                  {isTargetAchieved && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Target Tercapai!
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-stone-500 mt-0.5 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>{activeCelengan.targetTitle || 'Target Tabungan'}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {daysLeftLabel && (
                  <div className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 border border-stone-200/60">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    <span>Tenggat: {daysLeftLabel}</span>
                  </div>
                )}
                <button
                  id="btn-edit-target-direct"
                  onClick={() => setIsEditTargetOpen(true)}
                  className="text-xs font-bold text-stone-700 hover:text-stone-900 hover:underline flex items-center gap-1 px-2 py-1"
                >
                  Ubah Target
                </button>
              </div>
            </div>

            {/* Visual Piggy Bank Stage */}
            <PiggyBankVisual
              celengan={activeCelengan}
              balance={currentBalance}
              isMuted={isMuted}
              onDepositClick={() => setIsDepositOpen(true)}
              triggerCoinDrop={coinDropCounter}
            />

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                id="btn-main-deposit"
                onClick={() => setIsDepositOpen(true)}
                className="py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <span>Nabung Sekarang (Isi Celengan)</span>
              </button>

              <button
                id="btn-main-withdraw"
                onClick={() => setIsWithdrawOpen(true)}
                disabled={currentBalance <= 0}
                className="py-4 px-6 rounded-2xl bg-white hover:bg-stone-50 active:scale-[0.99] border-2 border-stone-200 hover:border-rose-300 disabled:opacity-40 text-stone-800 hover:text-rose-700 font-extrabold text-base shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                  <Minus className="w-4 h-4 text-stone-600" />
                </div>
                <span>Ambil Uang / Pecahkan Celengan</span>
              </button>
            </div>

            {/* Savings Statistics & Recommendations */}
            <CelenganStats
              celengan={activeCelengan}
              transactions={activeTransactions}
              currentBalance={currentBalance}
            />

            {/* Transaction History Section */}
            <TransactionHistory
              transactions={activeTransactions}
              onDeleteTransaction={handleDeleteTransaction}
              onClearAll={handleClearHistory}
              celenganName={activeCelengan.name}
            />
          </>
        )}

        {activeTab === 'jadwal' && (
          <CourseScheduleView
            schedules={schedules}
            onAddSchedule={handleAddSchedule}
            onUpdateSchedule={handleUpdateSchedule}
            onDeleteSchedule={handleDeleteSchedule}
            onResetSchedules={handleResetSchedules}
          />
        )}

        {activeTab === 'tugas' && (
          <AssignmentsView
            assignments={assignments}
            schedules={schedules}
            onAddAssignment={handleAddAssignment}
            onUpdateAssignment={handleUpdateAssignment}
            onDeleteAssignment={handleDeleteAssignment}
            onResetAssignments={handleResetAssignments}
          />
        )}

        {activeTab === 'kuliah' && (
          <CollegeGoalsView
            goals={collegeGoals}
            onAddGoal={handleAddCollegeGoal}
            onUpdateGoal={handleUpdateCollegeGoal}
            onDeleteGoal={handleDeleteCollegeGoal}
            onConvertToCelengan={handleConvertToCelengan}
          />
        )}

        {activeTab === 'anggaran' && (
          <StudentBudgetView
            budget={studentBudget}
            onSaveBudget={handleSaveStudentBudget}
            onSwitchToCelenganTab={() => setActiveTab('celengan')}
          />
        )}

        {activeTab === 'tips' && (
          <StudentChallengesView
            onQuickDepositChallenge={handleQuickDepositChallenge}
            onSwitchToCelenganTab={() => setActiveTab('celengan')}
          />
        )}

        {/* Footer info, Owner Attribution & Reset option */}
        <div className="mt-8 pt-6 border-t border-stone-200/70 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-stone-600">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
              MH
            </div>
            <div>
              <p className="font-bold text-stone-900 flex items-center gap-1.5">
                <span>Tabunganku — Celengan Digital</span>
                <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-semibold border border-stone-200">
                  v1.0
                </span>
              </p>
              <p className="text-stone-500 text-[11px]">
                Pembuat & Pemilik Sistem: <strong className="text-stone-800 font-bold">Muhamad Hafizt</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-stone-400">
            <div className="flex items-center gap-1 text-[11px] text-stone-400 mr-1">
              <Info className="w-3 h-3" />
              <span>Data tersimpan lokal</span>
            </div>
            <span className="text-stone-300">•</span>
            <button
              id="btn-reset-celengan"
              onClick={handleClearHistory}
              className="hover:text-rose-600 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Kosongkan Riwayat Celengan</span>
            </button>
            <span className="text-stone-300">•</span>
            <button
              id="btn-reset-all-data"
              onClick={handleResetAllData}
              className="hover:text-rose-600 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Kosongkan Semua Data</span>
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        celengan={activeCelengan}
        currentBalance={currentBalance}
        isMuted={isMuted}
        onDeposit={handleDeposit}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        celengan={activeCelengan}
        currentBalance={currentBalance}
        isMuted={isMuted}
        onWithdraw={handleWithdraw}
      />

      <EditTargetModal
        isOpen={isEditTargetOpen}
        onClose={() => setIsEditTargetOpen(false)}
        celengan={activeCelengan}
        onSave={handleUpdateCelengan}
      />

      <NewCelenganModal
        isOpen={isNewCelenganOpen}
        onClose={() => setIsNewCelenganOpen(false)}
        onCreate={handleCreateCelengan}
      />

      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={studentProfile}
        onSaveProfile={(updated) => setStudentProfile(updated)}
      />
    </div>
  );
}
