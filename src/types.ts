export type MainMenuTab = 'celengan' | 'kuliah' | 'anggaran' | 'jadwal' | 'tugas' | 'tips';

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export interface CourseSchedule {
  id: string;
  courseName: string;
  code?: string;
  sks: number;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  room: string;
  lecturer: string;
  color?: string;
}

export type AssignmentStatus = 'todo' | 'in_progress' | 'completed';
export type AssignmentPriority = 'high' | 'medium' | 'low';

export interface CourseAssignment {
  id: string;
  title: string;
  courseName: string;
  deadlineDate: string;
  deadlineTime?: string;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  notes?: string;
}

export interface Transaction {
  id: string;
  celenganId: string;
  type: 'in' | 'out'; // 'in' = nabung, 'out' = tarik
  amount: number;
  date: string; // ISO string
  note: string;
  category: string;
}

export interface Celengan {
  id: string;
  name: string;
  targetTitle: string;
  targetAmount: number;
  targetDate?: string;
  color: 'emerald' | 'amber' | 'rose' | 'sky' | 'indigo';
  icon: 'piggy' | 'gadget' | 'holiday' | 'emergency' | 'gift' | 'car' | 'graduation';
  createdAt: string;
  isLocked?: boolean;
}

export interface CollegeGoalItem {
  id: string;
  category: 'ukt' | 'skripsi' | 'magang' | 'sertifikasi' | 'laptop' | 'wisuda';
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadlineDate: string;
  semester: number;
  notes: string;
}

export interface StudentProfile {
  name: string;
  nim: string;
  major: string;
  faculty: string;
  university: string;
  semester: number;
}

export interface StudentBudgetData {
  monthlyAllowance: number;
  kosRent: number;
  wifiAndBills: number;
  transportMonthly: number;
  collegeSupplies: number;
  hangoutBudget: number;
  savingsMonthly: number;
}
