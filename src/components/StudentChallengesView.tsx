import React, { useState } from 'react';
import { 
  Sparkles, 
  Coins, 
  Coffee, 
  Award, 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  PiggyBank, 
  Calendar,
  Flame,
  ArrowRight
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface StudentChallengesViewProps {
  onQuickDepositChallenge: (amount: number, note: string) => void;
  onSwitchToCelenganTab: () => void;
}

export const StudentChallengesView: React.FC<StudentChallengesViewProps> = ({
  onQuickDepositChallenge,
  onSwitchToCelenganTab,
}) => {
  // Checklist state stored locally in component or storage
  const [checklist, setChecklist] = useState<{ [id: string]: boolean }>({
    'c1': true,
    'c2': false,
    'c3': false,
    'c4': false,
    'c5': false,
    'c6': false,
  });

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checklistItems = [
    {
      id: 'c1',
      title: 'Pisahkan uang UKT semester depan di celengan terpisah',
      desc: 'Mencegah uang kuliah terpakai untuk nongkrong atau kebutuhan konsumtif.',
    },
    {
      id: 'c2',
      title: 'Hitung estimasi operasional Magang / PKL Semester 6',
      desc: 'Transport harian, kemeja putih/celana bahan, serta biaya makan di lokasi kerja.',
    },
    {
      id: 'c3',
      title: 'Mulai kumpulkan dana riset & cetak skripsi (Rp 1-2 Juta)',
      desc: 'Semester 7 nanti butuh biaya print berulang-ulang, jilid skripsi, & biaya sidang.',
    },
    {
      id: 'c4',
      title: 'Masak nasi sendiri di kos dan bawa botol minum ke kampus',
      desc: 'Menghemat rata-rata Rp 15.000 - Rp 20.000 setiap hari kuliah.',
    },
    {
      id: 'c5',
      title: 'Cek syarat tes TOEFL / sertifikasi kompetensi kelulusan',
      desc: 'Banyak kampus mewajibkan skor TOEFL tertentu sebelum diizinkan daftar sidang skripsi.',
    },
    {
      id: 'c6',
      title: 'Miliki dana darurat minimal setara 1 bulan uang kos',
      desc: 'Untuk antisipasi jika ada servis motor dadakan atau berobat saat sakit.',
    },
  ];

  const completedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Banner Motivasi */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3">
            <Flame className="w-3.5 h-3.5 text-amber-200" />
            <span>Habit Finansial Sukses Mahasiswa</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Tantangan & Tips Cerdas Mahasiswa
          </h2>
          <p className="text-amber-50 text-sm mt-1.5 leading-relaxed">
            Semester 5 adalah fase transisi paling menentukan. Mahasiswa yang membiasakan menabung receh dan mengontrol jajan akan lebih tenang saat memasuki masa magang dan skripsi.
          </p>
        </div>
      </div>

      {/* 3 Tantangan Menabung Spesifik */}
      <div>
        <h3 className="text-base font-extrabold text-stone-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Tantangan Menabung yang Mudah Dijalankan</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tantangan 1: Uang 20 Ribuan */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-400 transition-all">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                Metode Viral
              </span>
              <h4 className="text-base font-extrabold text-stone-900 mt-1.5">
                Tantangan Pecahan 20 Ribu
              </h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Tiap kali mendapatkan lembaran uang Rp 20.000 dari kembalian, pantang dibelanjakan! Langsung masukkan ke celengan.
              </p>
              <div className="mt-3 p-2.5 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-stone-700 font-semibold">
                💡 1 lembar/hari = <strong className="text-emerald-700">Rp 600.000/bln</strong>
              </div>
            </div>

            <button
              onClick={() => onQuickDepositChallenge(20000, 'Tantangan Lembar Rp 20.000')}
              className="mt-4 w-full py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <PiggyBank className="w-4 h-4" />
              <span>Nabung 20 Ribu Sekarang</span>
            </button>
          </div>

          {/* Tantangan 2: Kopi Kos Hemat */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 uppercase">
                Hemat Nongkrong
              </span>
              <h4 className="text-base font-extrabold text-stone-900 mt-1.5">
                Tantangan Kopi Rumahan Kos
              </h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Ganti es kopi susu cafe (Rp 18.000) dengan seduh kopi sachet/drip di kos (Rp 3.000). Selisih Rp 15.000 langsung cemplungkan ke celengan.
              </p>
              <div className="mt-3 p-2.5 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-stone-700 font-semibold">
                💡 Selisih harian = <strong className="text-amber-800">Rp 450.000/bln</strong>
              </div>
            </div>

            <button
              onClick={() => onQuickDepositChallenge(15000, 'Hemat Kopi: Seduh Sendiri di Kos')}
              className="mt-4 w-full py-2.5 px-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <PiggyBank className="w-4 h-4" />
              <span>Nabung 15 Ribu (Kopi)</span>
            </button>
          </div>

          {/* Tantangan 3: Koin Receh Kembalian */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-all">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                Uang Recehan
              </span>
              <h4 className="text-base font-extrabold text-stone-900 mt-1.5">
                Koin Receh Sisa Belanja
              </h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Koin Rp 1.000, 2.000, dan 5.000 sisa belanja warung jangan dibiarkan tercecer di meja kos. Kumpulkan rutin ke celengan.
              </p>
              <div className="mt-3 p-2.5 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-stone-700 font-semibold">
                💡 Receh 5K/hari = <strong className="text-blue-800">Rp 150.000/bln</strong>
              </div>
            </div>

            <button
              onClick={() => onQuickDepositChallenge(5000, 'Celengan Koin Receh Sisa Belanja')}
              className="mt-4 w-full py-2.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <PiggyBank className="w-4 h-4" />
              <span>Nabung 5 Ribu (Receh)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Checklist Finansial Mahasiswa Semester 5 */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <h3 className="font-extrabold text-stone-900 text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Checklist Finansial Mahasiswa Semester 5</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Tandai langkah persiapan yang sudah Anda lakukan menuju semester akhir & kelulusan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              {completedCount} dari {checklistItems.length} Selesai
            </span>
          </div>
        </div>

        <div className="mt-4 divide-y divide-stone-100">
          {checklistItems.map((item) => {
            const isChecked = !!checklist[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className="py-3.5 flex items-start gap-3.5 cursor-pointer group hover:bg-stone-50 -mx-2 px-2 rounded-2xl transition-colors"
              >
                <div className="mt-0.5 text-stone-400 group-hover:text-emerald-600 transition-colors">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className={`text-sm font-bold block ${
                      isChecked ? 'line-through text-stone-400' : 'text-stone-900'
                    }`}
                  >
                    {item.title}
                  </span>
                  <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
          <p className="text-xs text-stone-400">
            Kunci utama mahasiswa berprestasi dan tenang finansial: <em>"Disiplin menyisihkan, bukan menyisakan."</em>
          </p>

          <button
            onClick={onSwitchToCelenganTab}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Celengan Saya</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
