import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Trash2, 
  Edit3, 
  BookOpen, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Info,
  LayoutGrid,
  Table as TableIcon,
  GraduationCap
} from 'lucide-react';
import { CourseSchedule, DayOfWeek } from '../types';
import { INITIAL_COURSE_SCHEDULES } from '../utils/storage';

interface CourseScheduleViewProps {
  schedules: CourseSchedule[];
  onAddSchedule: (schedule: CourseSchedule) => void;
  onUpdateSchedule: (schedule: CourseSchedule) => void;
  onDeleteSchedule: (id: string) => void;
  onResetSchedules: () => void;
}

const DAYS_LIST: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const DAY_ORDER: Record<string, number> = {
  'Senin': 1,
  'Selasa': 2,
  'Rabu': 3,
  'Kamis': 4,
  'Jumat': 5,
  'Sabtu': 6,
  'Minggu': 7,
};

export const CourseScheduleView: React.FC<CourseScheduleViewProps> = ({
  schedules,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onResetSchedules,
}) => {
  // Determine current day in Indonesian
  const dayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const currentDayName: DayOfWeek | 'Minggu' = 
    dayIndex === 1 ? 'Senin' :
    dayIndex === 2 ? 'Selasa' :
    dayIndex === 3 ? 'Rabu' :
    dayIndex === 4 ? 'Kamis' :
    dayIndex === 5 ? 'Jumat' :
    dayIndex === 6 ? 'Sabtu' : 'Minggu';

  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CourseSchedule | null>(null);

  // Form state
  const [courseName, setCourseName] = useState('');
  const [code, setCode] = useState('');
  const [sks, setSks] = useState<number>(3);
  const [day, setDay] = useState<DayOfWeek>('Senin');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:30');
  const [room, setRoom] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [color, setColor] = useState('emerald');

  const totalSks = schedules.reduce((acc, curr) => acc + (curr.sks || 0), 0);

  // Chronological sort: by Day Order (Senin -> Jumat) then by startTime
  const filteredSchedules = useMemo(() => {
    return [...schedules]
      .filter((s) => selectedDayFilter === 'Semua' || s.day === selectedDayFilter)
      .sort((a, b) => {
        const dayDiff = (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99);
        if (dayDiff !== 0) return dayDiff;
        return a.startTime.localeCompare(b.startTime);
      });
  }, [schedules, selectedDayFilter]);

  const todaysClasses = useMemo(() => {
    return schedules
      .filter((s) => s.day === currentDayName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedules, currentDayName]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setCourseName('');
    setCode('');
    setSks(3);
    setDay(currentDayName === 'Minggu' ? 'Senin' : currentDayName);
    setStartTime('08:00');
    setEndTime('10:30');
    setRoom('');
    setLecturer('');
    setColor('emerald');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: CourseSchedule) => {
    setEditingItem(item);
    setCourseName(item.courseName);
    setCode(item.code || '');
    setSks(item.sks);
    setDay(item.day);
    setStartTime(item.startTime);
    setEndTime(item.endTime);
    setRoom(item.room);
    setLecturer(item.lecturer);
    setColor(item.color || 'emerald');
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim() || !startTime || !endTime) return;

    if (editingItem) {
      onUpdateSchedule({
        ...editingItem,
        courseName: courseName.trim(),
        code: code.trim() || undefined,
        sks: Number(sks),
        day,
        startTime,
        endTime,
        room: room.trim() || 'Ruang Kuliah',
        lecturer: lecturer.trim() || 'Dosen Pengampu',
        color,
      });
    } else {
      const newSchedule: CourseSchedule = {
        id: `sch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        courseName: courseName.trim(),
        code: code.trim() || undefined,
        sks: Number(sks),
        day,
        startTime,
        endTime,
        room: room.trim() || 'Ruang Kuliah',
        lecturer: lecturer.trim() || 'Dosen Pengampu',
        color,
      };
      onAddSchedule(newSchedule);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-50 text-sky-800 border border-sky-200">
              Teknik Informatika • FKOM UNIKU
            </span>
            <span className="text-xs text-stone-500 font-semibold">
              Semester 5
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 tracking-tight">
            Jadwal Kuliah Mingguan
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Jadwal kelas, lab komputer, dosen pengampu, dan akumulasi SKS semester 5 Teknik Informatika UNIKU.
          </p>
        </div>

        {/* Quick SKS, View Mode & Action buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200/70 text-right">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Beban</span>
            <span className="text-sm font-black text-stone-900 tabular-nums">
              {totalSks} SKS <span className="text-xs font-normal text-stone-500">({schedules.length} Matkul)</span>
            </span>
          </div>

          {/* View Mode Toggle: Cards vs Table */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Tampilan Kartu"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kartu</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Tampilan Tabel KRS"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tabel KRS</span>
            </button>
          </div>

          <button
            id="btn-add-schedule"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Matkul</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Muat ulang 10 mata kuliah terurut semester 5 dari KRS UNIKU?')) {
                onResetSchedules();
              }
            }}
            title="Reset ke Jadwal KRS UNIKU (10 Matkul)"
            className="p-2.5 rounded-2xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Kelas Hari Ini */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-700 text-white rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Hari Ini: {currentDayName}</span>
          </div>
          <h3 className="text-lg font-black text-white mt-1.5">
            {todaysClasses.length > 0 
              ? `Ada ${todaysClasses.length} mata kuliah yang harus dihadiri hari ini`
              : currentDayName === 'Minggu'
              ? 'Hari Minggu libur! Manfaatkan untuk istirahat & review materi.'
              : 'Tidak ada jadwal kuliah hari ini. Waktu luang untuk cicil tugas!'}
          </h3>
          {todaysClasses.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {todaysClasses.map((c) => (
                <span key={c.id} className="text-xs bg-white/15 px-2.5 py-1 rounded-xl font-medium border border-white/20">
                  {c.startTime} • {c.courseName} ({c.room})
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Day Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedDayFilter('Semua')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedDayFilter === 'Semua'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Semua Hari
        </button>

        {DAYS_LIST.map((dayName) => {
          const count = schedules.filter((s) => s.day === dayName).length;
          const isToday = dayName === currentDayName;
          const isSelected = selectedDayFilter === dayName;

          return (
            <button
              key={dayName}
              onClick={() => setSelectedDayFilter(dayName)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>{dayName}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  {count}
                </span>
              )}
              {isToday && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Course Schedule Content (Table or Cards) */}
      {filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 text-center">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="font-bold text-stone-700 text-sm">Tidak ada jadwal kuliah untuk hari ini.</p>
          <p className="text-xs text-stone-400 mt-1">
            Klik tombol "Tambah Matkul" di atas untuk menambahkan jadwal kelas baru.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1e73be] text-white font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3.5 w-12 text-center">No</th>
                  <th className="px-4 py-3.5">Nama Kelas</th>
                  <th className="px-4 py-3.5">Jadwal</th>
                  <th className="px-4 py-3.5 text-center">SKS</th>
                  <th className="px-4 py-3.5 text-center">Semester</th>
                  <th className="px-4 py-3.5">Dosen Pengajar</th>
                  <th className="px-4 py-3.5">Ruang / Status</th>
                  <th className="px-4 py-3.5 text-right w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSchedules.map((item, idx) => {
                  const isToday = item.day === currentDayName;
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-sky-50/50 transition-colors ${
                        isToday ? 'bg-amber-50/40' : idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/40'
                      }`}
                    >
                      <td className="px-4 py-3.5 text-center font-bold text-stone-500">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-extrabold text-stone-900 text-sm">{item.courseName}</div>
                        {item.code && (
                          <div className="text-[10px] font-bold text-stone-400 font-mono mt-0.5">{item.code}</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-bold text-stone-800">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-black">{item.day}</span>
                          <span>{item.startTime} - {item.endTime}</span>
                        </span>
                        {isToday && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-800">Hari Ini</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
                          {item.sks} SKS
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-stone-600">
                        5
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-stone-700">
                        {item.lecturer}
                      </td>
                      <td className="px-4 py-3.5 text-stone-600 text-xs">
                        <div className="font-medium text-stone-800">{item.room}</div>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-800 border border-sky-200 mt-1">
                          Reguler Pagi
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors mr-1 cursor-pointer"
                          title="Edit Matkul"
                        >
                          <Edit3 className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus jadwal mata kuliah "${item.courseName}"?`)) {
                              onDeleteSchedule(item.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Matkul"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchedules.map((item) => {
            const isToday = item.day === currentDayName;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border p-5 shadow-xs transition-all relative flex flex-col justify-between ${
                  isToday 
                    ? 'border-emerald-300 ring-2 ring-emerald-500/10' 
                    : 'border-stone-200/80 hover:border-stone-300'
                }`}
              >
                <div>
                  {/* Header Card: Day, Time & SKS */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 text-xs font-black">
                        {item.day}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-stone-600">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{item.startTime} - {item.endTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-black border border-emerald-200">
                        {item.sks} SKS
                      </span>
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 text-[10px] font-black border border-amber-200">
                          Hari Ini
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Course Title & Code */}
                  <div className="mt-3">
                    {item.code && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">
                        {item.code}
                      </span>
                    )}
                    <h4 className="text-base font-black text-stone-900 leading-snug">
                      {item.courseName}
                    </h4>
                  </div>

                  {/* Details: Room and Lecturer */}
                  <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="font-semibold text-stone-700 truncate">{item.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="font-medium text-stone-600 truncate">{item.lecturer}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                    title="Edit jadwal matkul"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus jadwal mata kuliah "${item.courseName}"?`)) {
                        onDeleteSchedule(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus jadwal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Option to Reset to Default Schedules */}
      <div className="flex items-center justify-between pt-2 text-xs text-stone-400">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          <span>Jadwal tersimpan secara lokal dan otomatis</span>
        </span>

        <button
          onClick={() => {
            if (window.confirm('Kembalikan jadwal kuliah ke standar Semester 5?')) {
              onResetSchedules();
            }
          }}
          className="hover:text-stone-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Kembalikan Jadwal Bawaan Semester 5</span>
        </button>
      </div>

      {/* Modal Add / Edit Schedule */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-black text-stone-900 mb-1">
              {editingItem ? 'Edit Jadwal Kuliah' : 'Tambah Mata Kuliah Baru'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Isi informasi mata kuliah, waktu, ruangan, dan dosen pengampu.
            </p>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Nama Mata Kuliah *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pemrograman Web Lanjut"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Kode Matkul
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PWL-502"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Bobot SKS
                  </label>
                  <select
                    value={sks}
                    onChange={(e) => setSks(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value={1}>1 SKS</option>
                    <option value={2}>2 SKS</option>
                    <option value={3}>3 SKS</option>
                    <option value={4}>4 SKS</option>
                    <option value={6}>6 SKS (Skripsi/Magang)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Hari *
                  </label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as DayOfWeek)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    {DAYS_LIST.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Mulai *
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Selesai *
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Ruang Kuliah / Lab
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Gedung B Ruang 302 / Lab 4"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Nama Dosen Pengampu
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dr. Ir. Hendra Gunawan, M.T."
                  value={lecturer}
                  onChange={(e) => setLecturer(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
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
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
