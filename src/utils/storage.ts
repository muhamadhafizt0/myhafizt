import { Celengan, Transaction, CollegeGoalItem, StudentBudgetData, CourseSchedule, CourseAssignment, StudentProfile } from '../types';

const STORAGE_KEY_CELENGAN = 'tabunganku_celengan_v3';
const STORAGE_KEY_TRANSACTIONS = 'tabunganku_transactions_v3';
const STORAGE_KEY_ACTIVE_ID = 'tabunganku_active_id_v3';
const STORAGE_KEY_MUTED = 'tabunganku_is_muted_v3';
const STORAGE_KEY_STUDENT_PROFILE = 'tabunganku_student_profile_uniku_v1';
const STORAGE_KEY_COLLEGE_GOALS = 'tabunganku_college_goals_uniku_v2';
const STORAGE_KEY_STUDENT_BUDGET = 'tabunganku_student_budget_uniku_v2';
const STORAGE_KEY_SCHEDULE = 'tabunganku_course_schedule_uniku_krs_v3';
const STORAGE_KEY_ASSIGNMENTS = 'tabunganku_course_assignments_uniku_krs_v3';

// Immediately purge any legacy dummy data keys from localStorage
try {
  const legacyKeys = [
    'tabunganku_celengan_list_v1',
    'tabunganku_transactions_v1',
    'tabunganku_active_id_v1',
    'tabunganku_is_muted_v1',
    'tabunganku_celengan_list_clean_v2',
    'tabunganku_transactions_clean_v2',
    'tabunganku_active_id_clean_v2',
    'tabunganku_is_muted_clean_v2',
  ];
  legacyKeys.forEach((key) => localStorage.removeItem(key));
} catch {
  // Ignore storage access restrictions in certain iframe sandboxes
}

export const DEFAULT_CELENGAN_ID = 'celengan-tabunganku-main';

const INITIAL_CELENGAN: Celengan[] = [
  {
    id: DEFAULT_CELENGAN_ID,
    name: 'Tabunganku',
    targetTitle: 'Target Impian',
    targetAmount: 1000000,
    color: 'emerald',
    icon: 'piggy',
    createdAt: new Date().toISOString(),
  },
];

// Completely clean - zero dummy transactions
const INITIAL_TRANSACTIONS: Transaction[] = [];

export function loadCelenganList(): Celengan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CELENGAN);
    if (!raw) {
      saveCelenganList(INITIAL_CELENGAN);
      return INITIAL_CELENGAN;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_CELENGAN;
  } catch {
    return INITIAL_CELENGAN;
  }
}

export function saveCelenganList(list: Celengan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CELENGAN, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save celengan list:', err);
  }
}

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    if (!raw) {
      saveTransactions(INITIAL_TRANSACTIONS);
      return INITIAL_TRANSACTIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out any legacy dummy seed items if any survived
      const clean = parsed.filter((tx: Transaction) => !tx.id.startsWith('tx-seed-'));
      return clean;
    }
    return INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveTransactions(txs: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(txs));
  } catch (err) {
    console.error('Failed to save transactions:', err);
  }
}

export function loadActiveCelenganId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || DEFAULT_CELENGAN_ID;
  } catch {
    return DEFAULT_CELENGAN_ID;
  }
}

export function saveActiveCelenganId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
  } catch (err) {
    console.error('Failed to save active id:', err);
  }
}

export function loadSoundMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_MUTED) === 'true';
  } catch {
    return false;
  }
}

export function saveSoundMuted(muted: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_MUTED, String(muted));
  } catch (err) {
    console.error('Failed to save sound mute preference:', err);
  }
}

export function clearAllAppData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEY_CELENGAN);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
    localStorage.removeItem(STORAGE_KEY_COLLEGE_GOALS);
    localStorage.removeItem(STORAGE_KEY_STUDENT_BUDGET);
  } catch (err) {
    console.error('Failed to clear app data:', err);
  }
}

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: 'Muhamad Hafizt',
  nim: '20220810012',
  major: 'Teknik Informatika (S1)',
  faculty: 'Fakultas Ilmu Komputer (FKOM)',
  university: 'Universitas Kuningan (UNIKU)',
  semester: 5,
};

export function loadStudentProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENT_PROFILE);
    if (!raw) {
      saveStudentProfile(INITIAL_STUDENT_PROFILE);
      return INITIAL_STUDENT_PROFILE;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === 'string') {
      return {
        ...INITIAL_STUDENT_PROFILE,
        ...parsed,
      };
    }
    return INITIAL_STUDENT_PROFILE;
  } catch {
    return INITIAL_STUDENT_PROFILE;
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_STUDENT_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save student profile:', err);
  }
}

export const INITIAL_COLLEGE_GOALS: CollegeGoalItem[] = [
  {
    id: 'goal-ukt-6',
    category: 'ukt',
    title: 'Biaya UKT / BPP Semester 6 FKOM UNIKU',
    targetAmount: 3500000,
    currentAmount: 0,
    deadlineDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    semester: 6,
    notes: 'Registrasi ulang semester genap dan pengisian KRS online di Sistem Akademik UNIKU',
  },
  {
    id: 'goal-magang-pkl',
    category: 'magang',
    title: 'Dana Kerja Praktik (KP) / Magang Mahasiswa TI',
    targetAmount: 1500000,
    currentAmount: 0,
    deadlineDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    semester: 6,
    notes: 'Transport harian, pakaian kerja formal, dan operasional KP/magang di instansi/perusahaan',
  },
  {
    id: 'goal-skripsi',
    category: 'skripsi',
    title: 'Dana Riset Skripsi & Seminar Proposal S1 TI UNIKU',
    targetAmount: 2000000,
    currentAmount: 0,
    deadlineDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    semester: 7,
    notes: 'Print berkala naskah draft, revisi pembimbing, dan administrasi sidang munaqasyah FKOM UNIKU',
  },
  {
    id: 'goal-sertifikasi',
    category: 'sertifikasi',
    title: 'Sertifikasi Kompetensi IT (BNSP / Mikrotik / Cisco)',
    targetAmount: 800000,
    currentAmount: 0,
    deadlineDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    semester: 5,
    notes: 'Uji sertifikasi keahlian IT resmi untuk SKPI (Surat Keterangan Pendamping Ijazah) UNIKU',
  },
  {
    id: 'goal-toefl-uniku',
    category: 'sertifikasi',
    title: 'Tes TOEFL / EPT Pusat Bahasa Universitas Kuningan',
    targetAmount: 350000,
    currentAmount: 0,
    deadlineDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    semester: 5,
    notes: 'Syarat wajib lulus ujian kecakapan bahasa Inggris sebelum mendaftar sidang skripsi',
  },
  {
    id: 'goal-wisuda-uniku',
    category: 'wisuda',
    title: 'Dana Wisuda Sarjana Komputer (S.Kom) UNIKU',
    targetAmount: 2500000,
    currentAmount: 0,
    deadlineDate: new Date(Date.now() + 360 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    semester: 8,
    notes: 'Biaya toga wisuda, prosesi di Gedung Student Center Iman Hidayat UNIKU, dan foto kenangan',
  },
];

export const INITIAL_STUDENT_BUDGET: StudentBudgetData = {
  monthlyAllowance: 2000000,
  kosRent: 600000,
  wifiAndBills: 100000,
  transportMonthly: 150000,
  collegeSupplies: 100000,
  hangoutBudget: 200000,
  savingsMonthly: 250000,
};

export function loadCollegeGoals(): CollegeGoalItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COLLEGE_GOALS);
    if (!raw) {
      saveCollegeGoals(INITIAL_COLLEGE_GOALS);
      return INITIAL_COLLEGE_GOALS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_COLLEGE_GOALS;
  } catch {
    return INITIAL_COLLEGE_GOALS;
  }
}

export function saveCollegeGoals(goals: CollegeGoalItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_COLLEGE_GOALS, JSON.stringify(goals));
  } catch (err) {
    console.error('Failed to save college goals:', err);
  }
}

export function loadStudentBudget(): StudentBudgetData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENT_BUDGET);
    if (!raw) {
      saveStudentBudget(INITIAL_STUDENT_BUDGET);
      return INITIAL_STUDENT_BUDGET;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.monthlyAllowance === 'number') {
      return parsed;
    }
    return INITIAL_STUDENT_BUDGET;
  } catch {
    return INITIAL_STUDENT_BUDGET;
  }
}

export function saveStudentBudget(budget: StudentBudgetData): void {
  try {
    localStorage.setItem(STORAGE_KEY_STUDENT_BUDGET, JSON.stringify(budget));
  } catch (err) {
    console.error('Failed to save student budget:', err);
  }
}

export const INITIAL_COURSE_SCHEDULES: CourseSchedule[] = [
  {
    id: 'sch-1',
    courseName: 'Automata dan Teknik Kompilasi (24-01)',
    code: 'TINFCW243908',
    sks: 3,
    day: 'Senin',
    startTime: '15:30',
    endTime: '17:55',
    room: 'Ruang Kuliah FKOM UNIKU (Reguler Pagi)',
    lecturer: 'Rudi Hidayat, S.Kom.,M.Kom.',
    color: 'indigo',
  },
  {
    id: 'sch-2',
    courseName: 'Pemberdayaan Masyarakat (24-01)',
    code: 'UNIV0W240708',
    sks: 2,
    day: 'Selasa',
    startTime: '09:40',
    endTime: '11:15',
    room: 'Ruang Kuliah FKOM UNIKU (Reguler Pagi)',
    lecturer: 'Fauziah',
    color: 'amber',
  },
  {
    id: 'sch-3',
    courseName: 'Keamanan Cyber (24-01)',
    code: 'TINFCL240308',
    sks: 3,
    day: 'Selasa',
    startTime: '13:00',
    endTime: '15:25',
    room: 'Lab Komputer / Kelas FKOM UNIKU',
    lecturer: 'Fitra Nugraha, S.Kom., M.Kom.',
    color: 'rose',
  },
  {
    id: 'sch-4',
    courseName: 'Bahasa Indonesia (24-01)',
    code: 'UNIV0W240408',
    sks: 2,
    day: 'Rabu',
    startTime: '08:50',
    endTime: '10:25',
    room: 'Ruang Kuliah FKOM UNIKU (Reguler Pagi)',
    lecturer: 'Didi Ahyadi',
    color: 'emerald',
  },
  {
    id: 'sch-5',
    courseName: 'Pemrograman Multiplatform (24-01)',
    code: 'TINFCW243708',
    sks: 2,
    day: 'Rabu',
    startTime: '10:30',
    endTime: '12:05',
    room: 'Ruang Kuliah / Lab FKOM UNIKU',
    lecturer: 'Dede Husen, M.Kom.',
    color: 'sky',
  },
  {
    id: 'sch-6',
    courseName: 'Grafika Komputer (24-01)',
    code: 'TINFCW243508',
    sks: 2,
    day: 'Kamis',
    startTime: '08:00',
    endTime: '09:35',
    room: 'Ruang Kuliah FKOM UNIKU (Reguler Pagi)',
    lecturer: 'Rio Priantama',
    color: 'purple',
  },
  {
    id: 'sch-7',
    courseName: 'Komputasi Paralel dan Terdistribusi (24-01)',
    code: 'TINFCW244008',
    sks: 3,
    day: 'Kamis',
    startTime: '11:20',
    endTime: '14:35',
    room: 'Lab Komputasi FKOM UNIKU',
    lecturer: 'Iwan Lesmana',
    color: 'teal',
  },
  {
    id: 'sch-8',
    courseName: 'Praktikum Pemrograman Multiplatform (24-01)',
    code: 'TINFCW243808',
    sks: 1,
    day: 'Kamis',
    startTime: '14:40',
    endTime: '16:15',
    room: 'Lab Komputer FKOM UNIKU',
    lecturer: 'Dede Husen, M.Kom.',
    color: 'sky',
  },
  {
    id: 'sch-9',
    courseName: 'Rekayasa Perangkat Lunak (24-01)',
    code: 'TINFCW243408',
    sks: 3,
    day: 'Jumat',
    startTime: '13:00',
    endTime: '15:25',
    room: 'Ruang Kuliah FKOM UNIKU (Reguler Pagi)',
    lecturer: 'Rio Andriyat Krisdiawan, S.Kom., M.Kom.',
    color: 'emerald',
  },
  {
    id: 'sch-10',
    courseName: 'Praktikum Grafika Komputer (24-01)',
    code: 'TINFCW243608',
    sks: 1,
    day: 'Jumat',
    startTime: '15:30',
    endTime: '17:05',
    room: 'Lab Grafika & Multimedia FKOM UNIKU',
    lecturer: 'Rio Priantama',
    color: 'purple',
  },
];

export const INITIAL_COURSE_ASSIGNMENTS: CourseAssignment[] = [
  {
    id: 'ass-1',
    title: 'Dokumen Analisis Kebutuhan Perangkat Lunak (SRS IEEE 830)',
    courseName: 'Rekayasa Perangkat Lunak (24-01)',
    deadlineDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deadlineTime: '23:59',
    priority: 'high',
    status: 'in_progress',
    notes: 'Analisis kebutuhan fungsional & non-fungsional serta diagram Use Case kelompok.',
  },
  {
    id: 'ass-2',
    title: 'Proyek Aplikasi Mobile Multiplatform (UI Design & State Management)',
    courseName: 'Pemrograman Multiplatform (24-01)',
    deadlineDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deadlineTime: '21:00',
    priority: 'high',
    status: 'todo',
    notes: 'Pembuatan antarmuka aplikasi mobile dengan Flutter / React Native, upload GitHub repo.',
  },
  {
    id: 'ass-3',
    title: 'Simulasi Keamanan: Analisis Vulnerability Port & Firewall Mitigasi',
    courseName: 'Keamanan Cyber (24-01)',
    deadlineDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deadlineTime: '15:00',
    priority: 'high',
    status: 'todo',
    notes: 'Praktikum analisis scanning port jaringan menggunakan Wireshark & Nmap di lingkungan sandbox.',
  },
  {
    id: 'ass-4',
    title: 'Tugas Perancangan Lexical Analyzer & Parsing Grammar Bahasa',
    courseName: 'Automata dan Teknik Kompilasi (24-01)',
    deadlineDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deadlineTime: '17:00',
    priority: 'medium',
    status: 'todo',
    notes: 'Implementasi Deterministic Finite Automata (DFA) dan pengenalan token sintaks.',
  },
  {
    id: 'ass-5',
    title: 'Praktikum Rendering Objek 2D Menggunakan OpenGL / WebGL',
    courseName: 'Praktikum Grafika Komputer (24-01)',
    deadlineDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deadlineTime: '16:00',
    priority: 'medium',
    status: 'todo',
    notes: 'Source code algoritma Bresenham dan DDA garis 2 dimensi.',
  },
  {
    id: 'ass-6',
    title: 'Implementasi Multithreading & Paralelisasi Algoritma Matriks',
    courseName: 'Komputasi Paralel dan Terdistribusi (24-01)',
    deadlineDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deadlineTime: '20:00',
    priority: 'medium',
    status: 'todo',
    notes: 'Pengukuran speedup dan efisiensi eksekusi paralel dibanding sekuensial.',
  },
];

export function loadCourseSchedules(): CourseSchedule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SCHEDULE);
    if (!raw) {
      saveCourseSchedules(INITIAL_COURSE_SCHEDULES);
      return INITIAL_COURSE_SCHEDULES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_COURSE_SCHEDULES;
  } catch {
    return INITIAL_COURSE_SCHEDULES;
  }
}

export function saveCourseSchedules(schedules: CourseSchedule[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(schedules));
  } catch (err) {
    console.error('Failed to save course schedules:', err);
  }
}

export function loadCourseAssignments(): CourseAssignment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ASSIGNMENTS);
    if (!raw) {
      saveCourseAssignments(INITIAL_COURSE_ASSIGNMENTS);
      return INITIAL_COURSE_ASSIGNMENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_COURSE_ASSIGNMENTS;
  } catch {
    return INITIAL_COURSE_ASSIGNMENTS;
  }
}

export function saveCourseAssignments(assignments: CourseAssignment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(assignments));
  } catch (err) {
    console.error('Failed to save course assignments:', err);
  }
}



