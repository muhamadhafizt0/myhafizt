import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Edit3, 
  Filter, 
  BookOpen, 
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  Flame
} from 'lucide-react';
import { CourseAssignment, AssignmentStatus, AssignmentPriority, CourseSchedule } from '../types';
import { INITIAL_COURSE_ASSIGNMENTS } from '../utils/storage';

interface AssignmentsViewProps {
  assignments: CourseAssignment[];
  schedules: CourseSchedule[];
  onAddAssignment: (assignment: CourseAssignment) => void;
  onUpdateAssignment: (assignment: CourseAssignment) => void;
  onDeleteAssignment: (id: string) => void;
  onResetAssignments: () => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  schedules,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
  onResetAssignments,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | AssignmentStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | AssignmentPriority>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CourseAssignment | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('23:59');
  const [priority, setPriority] = useState<AssignmentPriority>('medium');
  const [status, setStatus] = useState<AssignmentStatus>('todo');
  const [notes, setNotes] = useState('');

  // Course options from existing schedules
  const availableCourses = Array.from(new Set(schedules.map((s) => s.courseName)));

  // Calculate stats
  const totalCount = assignments.length;
  const completedCount = assignments.filter((a) => a.status === 'completed').length;
  const inProgressCount = assignments.filter((a) => a.status === 'in_progress').length;
  const todoCount = assignments.filter((a) => a.status === 'todo').length;
  const pendingCount = totalCount - completedCount;

  // Filter & sort: earliest deadline first
  const filteredAssignments = assignments
    .filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      // Completed items go to the bottom
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime();
    });

  // Calculate days left helper
  const getDeadlineBadge = (dateStr: string, timeStr?: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(dateStr);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `Terlewat ${Math.abs(diffDays)} hari`,
        className: 'bg-rose-100 text-rose-800 border-rose-200 font-black',
        isUrgent: true,
      };
    } else if (diffDays === 0) {
      return {
        text: `Hari Ini (${timeStr || '23:59'})`,
        className: 'bg-amber-100 text-amber-900 border-amber-300 font-black animate-pulse',
        isUrgent: true,
      };
    } else if (diffDays === 1) {
      return {
        text: 'Besok',
        className: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
        isUrgent: true,
      };
    } else {
      return {
        text: `${diffDays} hari lagi`,
        className: 'bg-stone-100 text-stone-700 border-stone-200 font-semibold',
        isUrgent: false,
      };
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setCourseName(availableCourses[0] || '');
    // Default deadline in 3 days
    const defDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setDeadlineDate(defDate);
    setDeadlineTime('23:59');
    setPriority('medium');
    setStatus('todo');
    setNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: CourseAssignment) => {
    setEditingItem(item);
    setTitle(item.title);
    setCourseName(item.courseName);
    setDeadlineDate(item.deadlineDate);
    setDeadlineTime(item.deadlineTime || '23:59');
    setPriority(item.priority);
    setStatus(item.status);
    setNotes(item.notes || '');
    setIsAddModalOpen(true);
  };

  const handleToggleComplete = (item: CourseAssignment) => {
    const nextStatus: AssignmentStatus = item.status === 'completed' ? 'todo' : 'completed';
    onUpdateAssignment({ ...item, status: nextStatus });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseName.trim() || !deadlineDate) return;

    if (editingItem) {
      onUpdateAssignment({
        ...editingItem,
        title: title.trim(),
        courseName: courseName.trim(),
        deadlineDate,
        deadlineTime,
        priority,
        status,
        notes: notes.trim() || undefined,
      });
    } else {
      const newAssignment: CourseAssignment = {
        id: `ass-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        courseName: courseName.trim(),
        deadlineDate,
        deadlineTime,
        priority,
        status,
        notes: notes.trim() || undefined,
      };
      onAddAssignment(newAssignment);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 border border-amber-200">
              Teknik Informatika • FKOM UNIKU
            </span>
            <span className="text-xs text-stone-500 font-semibold">
              Semester 5 (Tugas & Proyek)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 tracking-tight">
            Daftar Tugas & Deadline
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Pantau tenggat waktu tugas makalah, tugas praktikum lab, dan proyek tim mahasiswa TI UNIKU.
          </p>
        </div>

        <button
          id="btn-add-assignment"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tugas Baru</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Total Tugas
          </span>
          <span className="text-2xl font-black text-stone-900 mt-1 block tabular-nums">
            {totalCount}
          </span>
          <span className="text-xs text-stone-500 mt-0.5 block">Semua tugas tercatat</span>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/80 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
            Belum Selesai
          </span>
          <span className="text-2xl font-black text-amber-700 mt-1 block tabular-nums">
            {pendingCount}
          </span>
          <span className="text-xs text-stone-500 mt-0.5 block">Harus dikerjakan</span>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/80 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
            Sedang Dikerjakan
          </span>
          <span className="text-2xl font-black text-blue-700 mt-1 block tabular-nums">
            {inProgressCount}
          </span>
          <span className="text-xs text-stone-500 mt-0.5 block">Dalam proses</span>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/80 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            Sudah Selesai
          </span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block tabular-nums">
            {completedCount}
          </span>
          <span className="text-xs text-stone-500 mt-0.5 block">Siap dikumpulkan</span>
        </div>
      </div>

      {/* Filter Tabs & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200/80">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Semua ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('todo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'todo'
                ? 'bg-amber-600 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Belum ({todoCount})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'in_progress'
                ? 'bg-blue-600 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Proses ({inProgressCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Selesai ({completedCount})
          </button>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <span className="font-semibold">Prioritas:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-stone-200 bg-stone-50 text-stone-700"
          >
            <option value="all">Semua Prioritas</option>
            <option value="high">Tinggi (Mendesak)</option>
            <option value="medium">Sedang</option>
            <option value="low">Rendah</option>
          </select>
        </div>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <p className="font-bold text-stone-700 text-sm">Tidak ada tugas pada kategori ini.</p>
          <p className="text-xs text-stone-400 mt-1">
            Semua tugas di filter ini sudah beres atau belum ada yang ditambahkan.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAssignments.map((item) => {
            const isCompleted = item.status === 'completed';
            const deadlineInfo = getDeadlineBadge(item.deadlineDate, item.deadlineTime);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border p-4 sm:p-5 shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCompleted 
                    ? 'border-stone-200/60 bg-stone-50/60 opacity-75' 
                    : deadlineInfo.isUrgent
                    ? 'border-amber-300 ring-2 ring-amber-500/10'
                    : 'border-stone-200/80 hover:border-stone-300'
                }`}
              >
                {/* Left: Checkbox + Title & Details */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleComplete(item)}
                    className="mt-1 text-stone-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                    title={isCompleted ? 'Tandai belum selesai' : 'Tandai sudah selesai'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700">
                        {item.courseName}
                      </span>

                      {/* Priority Badge */}
                      {item.priority === 'high' && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-rose-600" />
                          Prioritas Tinggi
                        </span>
                      )}
                      {item.priority === 'medium' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          Sedang
                        </span>
                      )}
                      {item.priority === 'low' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                          Rendah
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm sm:text-base font-extrabold mt-1 leading-snug ${
                        isCompleted ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {item.title}
                    </h4>

                    {item.notes && (
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Deadline Badge & Action Buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 shrink-0">
                  {/* Deadline Info */}
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{item.deadlineDate}</span>
                      {item.deadlineTime && (
                        <span className="font-mono text-[11px] text-stone-400">({item.deadlineTime})</span>
                      )}
                    </div>

                    <div className="mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md border inline-block ${deadlineInfo.className}`}>
                        {deadlineInfo.text}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Edit tugas"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus tugas "${item.title}"?`)) {
                          onDeleteAssignment(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus tugas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom info & reset */}
      <div className="flex items-center justify-between pt-2 text-xs text-stone-400">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          <span>Tugas tersimpan otomatis di perangkat Anda</span>
        </span>

        <button
          onClick={() => {
            if (window.confirm('Kembalikan daftar tugas ke contoh bawaan Semester 5?')) {
              onResetAssignments();
            }
          }}
          className="hover:text-stone-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Kembalikan Contoh Tugas Bawaan</span>
        </button>
      </div>

      {/* Modal Add / Edit Assignment */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-black text-stone-900 mb-1">
              {editingItem ? 'Edit Tugas Kuliah' : 'Tambah Tugas Baru'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Catat tugas, praktikum, makalah, atau proyek kelompok semester 5.
            </p>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Judul Tugas / Nama Pekerjaan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Proposal Judul Skripsi Bab 1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Mata Kuliah *
                </label>
                <input
                  type="text"
                  required
                  list="courseListSuggestions"
                  placeholder="Pilih atau ketik mata kuliah"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
                <datalist id="courseListSuggestions">
                  {availableCourses.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Tanggal Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Jam Deadline
                  </label>
                  <input
                    type="time"
                    value={deadlineTime}
                    onChange={(e) => setDeadlineTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Tingkat Prioritas
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as AssignmentPriority)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="high">Tinggi (Mendesak / Nilai Besar)</option>
                    <option value="medium">Sedang</option>
                    <option value="low">Rendah</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Status Pengerjaan
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="todo">Belum Dikerjakan</option>
                    <option value="in_progress">Sedang Dikerjakan</option>
                    <option value="completed">Sudah Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Catatan / Instruksi Tugas (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Format PDF, font Times New Roman, upload ke Google Classroom..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
