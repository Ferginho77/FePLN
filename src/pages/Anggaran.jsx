import {
  AlertCircle,
  CalendarDays,
  CircleDollarSign,
  Plus,
  Search,
  SquareChartGantt,
  Wallet,
  X,
  Loader2,
  Banknote,
  FolderOpen,
  Layers,
  FileText,
  Trash,
  Pencil
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GetAnggaran, CreateAnggaran, DeleteAnggaran, UpdateAnggaran } from '../api/AnggaranService';
import { GetProject } from '../api/ProjectService';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('id-ID');

function formatMonth(month) {
  const date = new Date(`${month}-01T00:00:00`);
  return Number.isNaN(date.getTime())
    ? month
    : date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

const INITIAL_FORM = {
  Bidang: '',
  Tahapan: '',
  RencanaAnggaran: '',
  Realisasi: '',
  TanggalAnggaran: '',
  ProyekId: '',
};

const BidangOption = [
  { value: 'Perizinan', label: 'Perizinan' },
  { value: 'Pengadaan Tanah', label: 'Pengadaan Tanah' },
  { value: 'Kompensasi ROW', label: 'Kompensasi ROW' },
  { value: 'Sertifikasi', label: 'Sertifikasi' },
];

export default function Anggaran() {
  const [anggaranData, setAnggaranData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [projectMap, setProjectMap] = useState({});
  const [projectList, setProjectList] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setFormData(INITIAL_FORM);
    setModalError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setModalError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi field wajib
    if (!formData.ProyekId) {
      setModalError('Silakan pilih proyek terlebih dahulu.');
      return;
    }
    if (!formData.Bidang) {
      setModalError('Silakan pilih bidang.');
      return;
    }
    if (!formData.Tahapan.trim()) {
      setModalError('Tahapan tidak boleh kosong.');
      return;
    }
    if (!formData.RencanaAnggaran || Number(formData.RencanaAnggaran) <= 0) {
      setModalError('Rencana anggaran harus lebih dari 0.');
      return;
    }
    if (!formData.TanggalAnggaran) {
      setModalError('Silakan pilih tanggal anggaran.');
      return;
    }

    setSubmitting(true);
    setModalError('');

    try {
      const payload = {
        ProyekId: Number(formData.ProyekId),
        Bidang: formData.Bidang,
        Tahapan: formData.Tahapan.trim(),
        RencanaAnggaran: Number(formData.RencanaAnggaran),
        Realisasi: Number(formData.Realisasi) || 0,
        TanggalAnggaran: formData.TanggalAnggaran,
      };

      await CreateAnggaran(payload);

      // Refresh data setelah berhasil
      setReloadKey((key) => key + 1);
      handleCloseModal();
    } catch (err) {
      console.error('Error creating anggaran:', err);
      setModalError(
        err.message || 'Gagal menyimpan anggaran. Silakan coba kembali.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchAll = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch anggaran & projects secara paralel
        const [anggaranResult, projectResult] = await Promise.all([
          GetAnggaran(),
          GetProject(),
        ]);

        // Normalise anggaran data
        const rawAnggaran = Array.isArray(anggaranResult)
          ? anggaranResult
          : anggaranResult?.data;
        if (!Array.isArray(rawAnggaran)) {
          throw new Error('Format data anggaran dari server tidak valid.');
        }

        // Normalise project data & buat map ProyekId → NamaProyek
        const rawProjects = Array.isArray(projectResult)
          ? projectResult
          : projectResult?.data ?? [];

        const pMap = {};
        const pList = [];
        rawProjects.forEach((p) => {
          const id = p.ProyekId ?? p.proyekId ?? p.id;
          const name = p.NamaProyek ?? p.namaProyek ?? p.nama ?? '';
          if (id !== undefined && id !== null) {
            pMap[String(id)] = name;
            pList.push({ id: String(id), name });
          }
        });

        const normalizedData = rawAnggaran.map((item) => ({
          ...item,
          id: item.id ?? item.AnggaranId ?? item.Id,
          month: item.month ?? item.Month ?? item.Bulan,
          // Resolusi nama proyek: utamakan dari relasi, fallback ke field langsung
          NamaProyek:
            (item.ProyekId !== undefined && item.ProyekId !== null
              ? pMap[String(item.ProyekId)]
              : undefined) ??
            item.NamaProyek ??
            item.namaProyek ??
            item.Project ??
            '—',
        }));

        if (active) {
          setAnggaranData(normalizedData);
          setProjectMap(pMap);
          setProjectList(pList);
          const availableMonths = [
            ...new Set(
              normalizedData
                .map((item) => item.month)
                .filter((m) => typeof m === 'string' && m),
            ),
          ].sort((a, b) => b.localeCompare(a));
          setSelectedMonth((current) =>
            current && availableMonths.includes(current)
              ? current
              : availableMonths[0] ?? '',
          );
        }
      } catch (fetchError) {
        if (active) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : 'Gagal memuat data anggaran.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const handleDeleteAnggaran = async (id) => {
    try {
      await DeleteAnggaran(id);
      setReloadKey((key) => key + 1);
    } catch (error) {
      console.error('Error deleting anggaran:', error);
      setError('Gagal menghapus anggaran. Silakan coba kembali.');
    }
  }

  const months = useMemo(
    () =>
      [
        ...new Set(
          anggaranData
            .map((item) => item.month)
            .filter((m) => typeof m === 'string' && m),
        ),
      ].sort((a, b) => b.localeCompare(a)),
    [anggaranData],
  );

  const visibleData = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('id-ID');
    return anggaranData.filter((item) => {
      const matchesMonth = !selectedMonth || item.month === selectedMonth;
      const matchesSearch =
        !normalizedSearch ||
        [item.NamaProyek, item.Bidang, item.Tahapan].some((value) =>
          String(value ?? '')
            .toLocaleLowerCase('id-ID')
            .includes(normalizedSearch),
        );
      return matchesMonth && matchesSearch;
    });
  }, [anggaranData, searchTerm, selectedMonth]);

  const summary = useMemo(
    () =>
      visibleData.reduce(
        (totals, item) => ({
          RencanaAnggaran:
            totals.RencanaAnggaran + (Number(item.RencanaAnggaran) || 0),
          Realisasi: totals.Realisasi + (Number(item.Realisasi) || 0),
        }),
        { RencanaAnggaran: 0, Realisasi: 0 },
      ),
    [visibleData],
  );

  const savings = summary.RencanaAnggaran - summary.Realisasi;
  const absorption =
    summary.RencanaAnggaran > 0
      ? Math.round((summary.Realisasi / summary.RencanaAnggaran) * 100)
      : 0;

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 text-left text-slate-800 dark:text-slate-200 sm:gap-7">
      <header className="flex flex-col justify-between gap-4 pb-2 pt-0 sm:flex-row sm:items-end sm:pt-1">
        <div>
          <h1 className="text-2xl font-bold leading-[1.15] tracking-tight sm:text-3xl lg:text-4xl">
            Anggaran Persekot Dinas
          </h1>
          <p className="mt-[0.6rem] max-w-2xl text-[0.85rem] leading-relaxed text-slate-500 dark:text-slate-400 sm:text-[0.925rem]">
            Rekap kebutuhan anggaran operasional bulanan. Bandingkan RencanaAnggaran dan Realisasi
            untuk memantau serapan serta penghematan setiap proyek.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenModal}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 sm:self-auto"
        >
          <Plus size={16} />
          Buat Rencana Anggaran
        </button>
      </header>

      {error && (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </span>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="self-start font-semibold underline underline-offset-2 sm:self-auto"
          >
            Coba lagi
          </button>
        </div>
      )}

      <section aria-label="Ringkasan anggaran" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Total Anggaran Rencana"
          value={error ? '—' : currencyFormatter.format(summary.RencanaAnggaran)}
          subtitle={error ? 'Data tidak tersedia' : `${numberFormatter.format(visibleData.length)} item anggaran`}
          icon={<SquareChartGantt size={22} className="text-blue-600 dark:text-blue-400" />}
          accent="blue"
          delay={0.05}
          loading={loading}
        />
        <SummaryCard
          title="Total Realisasi Anggaran"
          value={error ? '—' : currencyFormatter.format(summary.Realisasi)}
          subtitle={error ? 'Data tidak tersedia' : `Serapan ${absorption}% dari Rencana`}
          icon={<CircleDollarSign size={22} className="text-emerald-600 dark:text-emerald-400" />}
          accent="green"
          delay={0.1}
          loading={loading}
          progress={absorption}
        />
        <SummaryCard
          title={error || savings >= 0 ? 'Penghematan Anggaran' : 'Melebihi Anggaran'}
          value={error ? '—' : currencyFormatter.format(Math.abs(savings))}
          subtitle={error ? 'Data tidak tersedia' : savings >= 0 ? 'Sisa dari total Rencana' : 'Realisasi di atas Rencana'}
          icon={<Wallet size={22} className={savings >= 0 ? 'text-violet-600 dark:text-violet-400' : 'text-rose-600 dark:text-rose-400'} />}
          accent={savings >= 0 ? 'violet' : 'rose'}
          delay={0.15}
          loading={loading}
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Header & Control Section */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Rincian Anggaran
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              {loading ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-ping rounded-full bg-blue-500"></span>
                  Memuat data anggaran…
                </span>
              ) : (
                `${numberFormatter.format(visibleData.length)} data ditampilkan`
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Month Filter */}
            <label className="relative">
              <CalendarDays size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
              <select
                aria-label="Filter berdasarkan bulan"
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-8 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700/80 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-blue-400 dark:focus:bg-slate-800 dark:focus:ring-blue-400/10 sm:min-w-44"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                disabled={loading || months.length === 0}
              >
                <option value="">Semua bulan</option>
                {months.map((month) => (
                  <option key={month} value={month}>{formatMonth(month)}</option>
                ))}
              </select>
            </label>

            {/* Search Input */}
            <label className="relative">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                aria-label="Cari proyek atau bidang"
                placeholder="Cari proyek atau bidang…"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700/80 dark:bg-slate-800/50 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-800 dark:focus:ring-blue-400/10 sm:min-w-56"
              />
            </label>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
            <thead className="bg-emerald-50/80 dark:bg-emerald-800/40">
              <tr>
                <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Nama Proyek</th>
                <th scope="col" className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Bidang</th>
                <th scope="col" className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Rencana</th>
                <th scope="col" className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Realisasi</th>
                <th scope="col" className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Selisih</th>
                <th scope="col" className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 bg-white dark:divide-slate-800/60 dark:bg-slate-900">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
                    Memuat data anggaran…
                  </td>
                </tr>
              ) : visibleData.length > 0 ? (
                <AnimatePresence initial={false}>
                  {visibleData.map((item, index) => {
                    const plan = Number(item.RencanaAnggaran) || 0;
                    const actual = Number(item.Realisasi) || 0;
                    const difference = plan - actual;
                    const isSurplus = difference >= 0;

                    return (
                      <motion.tr
                        key={item.ProyekId ?? `${item.NamaProyek}-${item.Bidang}-${item.Tahapan}-${item.month}-${index}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                      >
                        {/* Nama Proyek */}
                        <td className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {item.NamaProyek || '—'}
                        </td>

                        {/* Bidang */}
                        <td className="px-5 py-3.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <span className="inline-block max-w-[200px] truncate align-bottom">
                            {item.Bidang || '—'}
                          </span>
                        </td>

                        {/* Rencana */}
                        <td className="whitespace-nowrap px-5 py-3.5 text-right text-xs font-medium tabular-nums text-slate-600 dark:text-slate-300">
                          {currencyFormatter.format(plan)}
                        </td>

                        {/* Realisasi */}
                        <td className="whitespace-nowrap px-5 py-3.5 text-right text-xs font-medium tabular-nums text-slate-600 dark:text-slate-300">
                          {currencyFormatter.format(actual)}
                        </td>

                        {/* Selisih Badge Style */}
                        <td className="whitespace-nowrap px-5 py-3 text-right">
                          <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold tabular-nums ${
                            isSurplus 
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                          }`}>
                            {isSurplus ? '+' : '−'}{currencyFormatter.format(Math.abs(difference))}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if(window.confirm(`Apakah anda yakin ingin menghapus ${item.NamaProyek}?`)){
                                handleDeleteAnggaran(item.AnggaranId);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
                            title="Hapus Anggaran"
                            aria-label={`Hapus ${item.NamaProyek}`}
                          >
                            <Trash size={15} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {error ? 'Data anggaran belum dapat ditampilkan.' : 'Tidak ada data anggaran.'}
                    </p>
                    {!error && (
                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        {searchTerm ? 'Coba ubah kata kunci pencarian atau filter bulan.' : 'Belum ada rincian untuk filter yang dipilih.'}
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================= */}
      {/* Modal Form Input Anggaran                                      */}
      {/* ============================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="anggaran-modal-title"
          >
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            />

            {/* Modal Content */}
            <motion.div
              className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                    <Banknote size={20} />
                  </div>
                  <div>
                    <h3
                      id="anggaran-modal-title"
                      className="text-lg font-bold leading-tight text-slate-900 dark:text-slate-50"
                    >
                      Buat Rencana Anggaran
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Lengkapi data anggaran untuk proyek yang dipilih
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                  aria-label="Tutup modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Error Message */}
              {modalError && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Field: Pilih Proyek */}
                <div>
                  <label
                    htmlFor="ProyekId"
                    className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <span className="flex items-center gap-1.5">
                      <FolderOpen size={14} className="text-slate-400" />
                      Proyek <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <select
                    id="ProyekId"
                    name="ProyekId"
                    required
                    value={formData.ProyekId}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:bg-slate-900"
                  >
                    <option value="">— Pilih Proyek —</option>
                    {projectList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Pilih proyek yang akan diisikan data anggaran.
                  </p>
                </div>

                {/* Field: Bidang */}
                <div>
                  <label
                    htmlFor="Bidang"
                    className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <span className="flex items-center gap-1.5">
                      <Layers size={14} className="text-slate-400" />
                      Bidang <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <select
                    id="Bidang"
                    name="Bidang"
                    required
                    value={formData.Bidang}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:bg-slate-900"
                  >
                    <option value="">— Pilih Bidang —</option>
                    {BidangOption.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field: Tahapan */}
                <div>
                  <label
                    htmlFor="Tahapan"
                    className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText size={14} className="text-slate-400" />
                      Tahapan <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    id="Tahapan"
                    name="Tahapan"
                    type="text"
                    required
                    placeholder="Contoh: Tahap Pengukuran Lahan"
                    value={formData.Tahapan}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-900"
                  />
                </div>

                {/* Field Group: Rencana Anggaran & Realisasi */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Rencana Anggaran */}
                  <div>
                    <label
                      htmlFor="RencanaAnggaran"
                      className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Rencana Anggaran (Rp) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                        Rp
                      </span>
                      <input
                        id="RencanaAnggaran"
                        name="RencanaAnggaran"
                        type="number"
                        min="0"
                        required
                        placeholder="0"
                        value={formData.RencanaAnggaran}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3.5 text-sm tabular-nums text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-900"
                      />
                    </div>
                  </div>

                  {/* Realisasi */}
                  <div>
                    <label
                      htmlFor="Realisasi"
                      className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Realisasi (Rp)
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                        Rp
                      </span>
                      <input
                        id="Realisasi"
                        name="Realisasi"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.Realisasi}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3.5 text-sm tabular-nums text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-900"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Kosongkan jika belum ada realisasi.
                    </p>
                  </div>
                </div>

                {/* Field: Tanggal Anggaran */}
                <div>
                  <label
                    htmlFor="TanggalAnggaran"
                    className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-slate-400" />
                      Tanggal Anggaran <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    id="TanggalAnggaran"
                    name="TanggalAnggaran"
                    type="date"
                    required
                    value={formData.TanggalAnggaran}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:bg-slate-900"
                  />
                </div>

                {/* Modal Footer / Action Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={submitting}
                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                  >
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    <span>{submitting ? 'Menyimpan...' : 'Simpan Anggaran'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

function SummaryCard({ title, value, subtitle, icon, accent, delay = 0, loading, progress }) {
  const accentStyles = {
    blue: 'bg-blue-50 dark:bg-blue-950/40',
    green: 'bg-emerald-50 dark:bg-emerald-950/40',
    violet: 'bg-violet-50 dark:bg-violet-950/40',
    rose: 'bg-rose-50 dark:bg-rose-950/40',
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -2 }}
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 truncate text-xl font-bold text-slate-900 dark:text-white sm:text-2xl" aria-live="polite">
            {loading ? 'Memuat…' : value}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${accentStyles[accent]}`}>
          {icon}
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700" aria-label={`Serapan anggaran ${progress}%`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            transition={{ duration: 0.6, delay: delay + 0.15 }}
            className="h-full rounded-full bg-emerald-500"
          />
        </div>
      )}
    </motion.article>
  );
}
