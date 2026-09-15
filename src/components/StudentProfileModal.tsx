import React, { useState } from 'react';
import { X, GraduationCap, School, User, Hash, CheckCircle2, ShieldCheck, Edit3 } from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [nim, setNim] = useState(profile.nim);
  const [major, setMajor] = useState(profile.major);
  const [faculty, setFaculty] = useState(profile.faculty);
  const [university, setUniversity] = useState(profile.university);
  const [semester, setSemester] = useState<number>(profile.semester);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: name.trim() || 'Muhamad Hafizt',
      nim: nim.trim() || '20220810012',
      major: major.trim() || 'Teknik Informatika (S1)',
      faculty: faculty.trim() || 'Fakultas Ilmu Komputer (FKOM)',
      university: university.trim() || 'Universitas Kuningan (UNIKU)',
      semester: Number(semester) || 5,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-stone-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900 leading-tight">
                Kartu Mahasiswa Digital
              </h3>
              <p className="text-xs text-stone-500">
                Profil Akademik Universitas Kuningan
              </p>
            </div>
          </div>

          <button
            id="btn-close-profile-modal"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Digital KTM Card */}
        <div className="mt-5 relative rounded-3xl overflow-hidden shadow-md border border-amber-300/40 bg-gradient-to-br from-emerald-800 via-teal-900 to-stone-900 text-white p-5 sm:p-6">
          {/* Decorative watermarks */}
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 -translate-x-8 translate-y-8 w-44 h-44 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* KTM Header */}
          <div className="flex items-start justify-between gap-3 border-b border-white/15 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                UNIKU
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-amber-300 uppercase block">
                  KARTU IDENTITAS MAHASISWA
                </span>
                <span className="text-xs sm:text-sm font-black text-white block leading-tight">
                  UNIVERSITAS KUNINGAN
                </span>
                <span className="text-[10px] text-emerald-200/90 font-medium">
                  FAKULTAS ILMU KOMPUTER (FKOM)
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-[10px] font-extrabold shrink-0">
              AKTIF
            </span>
          </div>

          {/* Student Info Body */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-amber-300/40 flex items-center justify-center text-amber-300 font-bold shadow-inner shrink-0">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-200" />
            </div>

            <div className="space-y-1 text-left flex-1 min-w-0">
              <div className="text-base sm:text-lg font-black text-white truncate tracking-tight">
                {profile.name}
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-200 font-mono font-bold">
                <Hash className="w-3.5 h-3.5 opacity-70" />
                <span>NIM: {profile.nim}</span>
              </div>
              <div className="text-xs text-emerald-100 font-medium truncate">
                Prodi: <strong className="text-white font-bold">{profile.major}</strong>
              </div>
              <div className="text-[11px] text-emerald-200/80">
                Status: <span className="text-amber-300 font-semibold">Semester {profile.semester}</span> (T.A. 2026/2027)
              </div>
            </div>
          </div>

          {/* KTM Footer Bar */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-200/70 font-mono">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TERVERIFIKASI SISTEM AKADEMIK</span>
            </div>
            <span>KUNINGAN, JAWA BARAT</span>
          </div>
        </div>

        {/* Edit Form Toggle */}
        {!isEditing ? (
          <div className="mt-5 flex items-center justify-between pt-2">
            <span className="text-xs text-stone-500">
              Perlu memperbarui NIM atau data semester Anda?
            </span>
            <button
              id="btn-edit-student-profile"
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Data</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-5 space-y-3 pt-2 border-t border-stone-100">
            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  NIM (Nomor Induk Mahasiswa)
                </label>
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold font-mono focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Semester Berjalan
                </label>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={semester}
                  onChange={(e) => setSemester(parseInt(e.target.value, 10) || 5)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Program Studi
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Fakultas
                </label>
                <input
                  type="text"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">
                Universitas
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-emerald-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-2 text-xs font-bold text-stone-500 hover:text-stone-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
