import React, { useState, useMemo } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  Trash2, 
  Download, 
  Calendar,
  Filter,
  PiggyBank
} from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onClearAll?: () => void;
  celenganName: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onDeleteTransaction,
  onClearAll,
  celenganName,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesType =
        filterType === 'all' ? true : tx.type === filterType;
      const matchesSearch =
        tx.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatRupiah(tx.amount).includes(searchTerm);
      return matchesType && matchesSearch;
    });
  }, [transactions, filterType, searchTerm]);

  // Export to CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['Tanggal', 'Jenis', 'Nominal (IDR)', 'Kategori', 'Catatan'];
    const rows = transactions.map((t) => [
      `"${new Date(t.date).toLocaleString('id-ID')}"`,
      t.type === 'in' ? '"Nabung (Masuk)"' : '"Tarik (Keluar)"',
      t.amount,
      `"${t.category || ''}"`,
      `"${t.note.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Riwayat_Tabunganku_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <h3 className="text-lg font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Riwayat Tabungan</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold border border-stone-200">
              {transactions.length} catatan
            </span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Semua mutasi setor dan tarik uang pada celengan {celenganName}
          </p>
        </div>

        {transactions.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onClearAll && (
              <button
                id="btn-clear-all-tx"
                onClick={onClearAll}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Hapus semua riwayat transaksi"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Kosongkan Riwayat</span>
              </button>
            )}
            <button
              id="btn-export-csv"
              onClick={handleExportCSV}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Unduh CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mt-4">
        {/* Type tabs */}
        <div className="flex items-center p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType('in')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              filterType === 'in'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-stone-500 hover:text-emerald-700'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Nabung
          </button>
          <button
            onClick={() => setFilterType('out')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              filterType === 'out'
                ? 'bg-white text-rose-700 shadow-2xs'
                : 'text-stone-500 hover:text-rose-700'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Tarik
          </button>
        </div>

        {/* Search input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-transactions"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari catatan, nominal, kategori..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="mt-4 divide-y divide-stone-100">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
              <PiggyBank className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-stone-700">Belum ada transaksi</p>
            <p className="text-xs text-stone-500 mt-1">
              {searchTerm
                ? 'Tidak ada transaksi yang cocok dengan pencarian Anda.'
                : 'Mulai masukkan uang receh atau tabungan pertama Anda!'}
            </p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="py-3.5 flex items-center justify-between gap-3 group hover:bg-stone-50/70 -mx-2 px-2 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Type Icon Badge */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    tx.type === 'in'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {tx.type === 'in' ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm truncate">
                      {tx.note || (tx.type === 'in' ? 'Menabung' : 'Penarikan')}
                    </span>
                    {tx.category && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200/80 shrink-0">
                        {tx.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(tx.date)}</span>
                  </div>
                </div>
              </div>

              {/* Amount and Delete Action */}
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-sm font-extrabold tabular-nums ${
                    tx.type === 'in' ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {tx.type === 'in' ? '+' : '-'} {formatRupiah(tx.amount)}
                </span>

                <button
                  onClick={() => {
                    if (window.confirm('Hapus catatan transaksi ini?')) {
                      onDeleteTransaction(tx.id);
                    }
                  }}
                  title="Hapus transaksi ini"
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
