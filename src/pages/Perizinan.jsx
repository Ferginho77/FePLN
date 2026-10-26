import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  CheckSquare,
  Square,
  Upload,
  User,
  AlertCircle,
  CheckCircle2,
  Calendar,
  X,
  FileCheck2,
  Layers,
  Info,
  UtilityPole,
  Lock,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { GetProject } from '../api/ProjectService';

const PERMIT_TYPES = [
  {
    id: 'KKPR',
    title: 'KKPR',
    subtitle: 'Kesesuaian Kegiatan Pemanfaatan Ruang',
    evidenRequired: false,
    badgeText: 'Eviden Opsional',
  },
  {
    id: 'Penetapan Lokasi',
    title: 'Izin Penetapan Lokasi',
    subtitle: 'Penetapan Lokasi Pembangunan (Penlok)',
    evidenRequired: true,
    badgeText: 'Wajib Eviden',
  },
  {
    id: 'Lingkungan',
    title: 'Izin Lingkungan',
    subtitle: 'Persetujuan Lingkungan Hidup (AMDAL / UKL-UPL)',
    evidenRequired: true,
    badgeText: 'Wajib Eviden',
  },
  {
    id: 'PPKH',
    title: 'Izin PPKH',
    subtitle: 'Persetujuan Penggunaan Kawasan Hutan',
    evidenRequired: true,
    badgeText: 'Wajib Eviden',
  },
  {
    id: 'PBG',
    title: 'Izin PBG',
    subtitle: 'Persetujuan Bangunan Gedung',
    evidenRequired: true,
    badgeText: 'Wajib Eviden',
  },
];

const INITIAL_FORM_ITEM = {
  tahapan: '',
  evidenFile: null,
  catatan: '',
  diisiOleh: '',
};

export default function Perizinan() {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const [selectedPermits, setSelectedPermits] = useState([]);
  const [formData, setFormData] = useState({});
  const [cardStatus, setCardStatus] = useState({});

  // Ambil daftar proyek dari API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const response = await GetProject();
        setProjects(response.data || response || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  // Proyek yang sedang dipilih
  const selectedProject = projects.find(
    (p) => String(p.ProyekId || p.id) === String(selectedProjectId)
  );

  // Handle ganti proyek
  const handleSelectProject = (e) => {
    const newProjectId = e.target.value;
    setSelectedProjectId(newProjectId);
    // Reset status saat ganti proyek
    setCardStatus({});
  };

  // Toggle selection jenis izin
  const handleTogglePermit = (permitId) => {
    if (!selectedProjectId) return;

    setSelectedPermits((prev) => {
      const isSelected = prev.includes(permitId);
      if (isSelected) {
        return prev.filter((id) => id !== permitId);
      } else {
        // Inisialisasi state form jika belum ada
        setFormData((prevForm) => ({
          ...prevForm,
          [permitId]: prevForm[permitId] || { ...INITIAL_FORM_ITEM },
        }));
        return [...prev, permitId];
      }
    });
  };

  const handleInputChange = (permitId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [permitId]: {
        ...(prev[permitId] || INITIAL_FORM_ITEM),
        [field]: value,
      },
    }));

    // Reset status pesan saat pengguna mulai mengedit kembali
    if (cardStatus[permitId]) {
      setCardStatus((prev) => ({
        ...prev,
        [permitId]: null,
      }));
    }
  };

  const handleFileChange = (permitId, e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    handleInputChange(permitId, 'evidenFile', file);
  };

  const handleRemoveFile = (permitId) => {
    handleInputChange(permitId, 'evidenFile', null);
  };

  const handleSubmitCard = (e, permit) => {
    e.preventDefault();
    const data = formData[permit.id] || INITIAL_FORM_ITEM;

    // Validasi field wajib
    if (!data.tahapan.trim()) {
      setCardStatus((prev) => ({
        ...prev,
        [permit.id]: {
          type: 'error',
          message: 'Tahapan saat ini wajib diisi.',
        },
      }));
      return;
    }

    // Validasi eviden: wajib untuk seluruh jenis izin kecuali KKPR
    if (permit.evidenRequired && !data.evidenFile) {
      setCardStatus((prev) => ({
        ...prev,
        [permit.id]: {
          type: 'error',
          message: `Dokumen eviden wajib dilampirkan untuk ${permit.title}.`,
        },
      }));
      return;
    }

    if (!data.diisiOleh.trim()) {
      setCardStatus((prev) => ({
        ...prev,
        [permit.id]: {
          type: 'error',
          message: 'Kolom "Diisi Oleh Siapa" wajib diisi.',
        },
      }));
      return;
    }

    // Simpan data update mingguan
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setCardStatus((prev) => ({
      ...prev,
      [permit.id]: {
        type: 'success',
        message: `Update mingguan ${permit.title} untuk "${selectedProject?.NamaProyek}" berhasil disimpan pada ${timeString}.`,
      },
    }));
  };

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 sm:gap-7 text-slate-800 dark:text-slate-200">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1 pb-1">
        <div>
          <p className="mb-2 text-[0.7rem] font-bold tracking-[0.14em] text-green-700 dark:text-green-400 uppercase">
            CONTROL BIDANG PERIZINAN
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.15]">
            Pembaruan Mingguan Perizinan
          </h1>
          <p className="mt-[0.6rem] max-w-xl text-[0.85rem] sm:text-[0.925rem] leading-relaxed text-slate-500 dark:text-slate-400">
            Pilih proyek terlebih dahulu, lalu tentukan jenis izin yang sedang berjalan untuk mengisi formulir tahapan, eviden, dan catatan mingguan.
          </p>
        </div>

        {selectedProject && selectedPermits.length > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-xs font-semibold text-green-700 dark:text-green-300 w-fit">
            <Layers size={14} />
            <span>{selectedPermits.length} jenis izin dipilih</span>
          </div>
        )}
      </header>

      {/* TAHAP 1: Pilih Proyek */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-700/70">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-green-600 text-white text-xs font-bold">
              1
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Pilih Proyek
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tentukan proyek yang akan diperbarui status perizinannya
              </p>
            </div>
          </div>

          {loadingProjects && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Loader2 size={15} className="animate-spin text-green-600" />
              <span>Memuat proyek...</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="relative max-w-xl">
            <select
              id="select-project"
              value={selectedProjectId}
              onChange={handleSelectProject}
              disabled={loadingProjects || projects.length === 0}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60 px-4 py-3 pr-10 text-sm font-medium text-slate-800 dark:text-slate-100 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-green-500/10 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">-- Pilih Proyek Terlebih Dahulu --</option>
              {projects.map((project) => {
                const pId = project.ProyekId || project.id;
                return (
                  <option key={pId} value={pId}>
                    {project.NamaProyek} {project.Jenis ? `(${project.Jenis})` : ''}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
              <ChevronDown size={18} />
            </div>
          </div>

          {/* Banner Informasi Proyek yang Dipilih */}
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3.5 flex flex-wrap items-center gap-3 p-3.5 rounded-xl border border-green-200 bg-green-50/50 dark:border-green-900/40 dark:bg-green-950/20 text-xs"
            >
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-green-600 text-white flex-shrink-0">
                <UtilityPole size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-[13px] truncate">
                  {selectedProject.NamaProyek}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Jenis: <strong className="text-slate-700 dark:text-slate-300">{selectedProject.Jenis || '-'}</strong></span>
                  <span>•</span>
                  <span>Perizinan Saat Ini: <strong className="text-slate-700 dark:text-slate-300">{selectedProject.Perizinan || '-'}</strong></span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* TAHAP 2: Checklist Pilihan Jenis Izin */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-700/70">
          <div className="flex items-center gap-2.5">
            <span
              className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-bold ${
                selectedProject
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}
            >
              2
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Pilih Jenis Izin
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Centang jenis izin yang ingin diperbarui untuk proyek yang dipilih
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Info size={13} />
            <span>Eviden wajib untuk semua izin, kecuali KKPR (opsional)</span>
          </div>
        </div>

        {/* Peringatan jika belum memilih proyek */}
        {!selectedProject ? (
          <div className="mt-4 flex items-center gap-2.5 p-3.5 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs font-medium">
            <Lock size={16} className="flex-shrink-0" />
            <span>Pilih proyek pada Langkah 1 terlebih dahulu untuk mengaktifkan pilihan jenis perizinan.</span>
          </div>
        ) : null}

        {/* List Checkbox Pilihan */}
        <div className={`mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 ${!selectedProject ? 'opacity-40 pointer-events-none select-none' : ''}`}>
          {PERMIT_TYPES.map((permit) => {
            const isChecked = selectedPermits.includes(permit.id);
            return (
              <button
                type="button"
                key={permit.id}
                disabled={!selectedProject}
                onClick={() => handleTogglePermit(permit.id)}
                className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isChecked
                    ? 'border-green-600 bg-green-50/50 dark:bg-green-950/20 shadow-sm ring-2 ring-green-600/10'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {permit.title}
                  </span>
                  {isChecked ? (
                    <CheckSquare size={18} className="text-green-600 flex-shrink-0" />
                  ) : (
                    <Square size={18} className="text-slate-400 flex-shrink-0" />
                  )}
                </div>

                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {permit.subtitle}
                </p>

                <div className="mt-3">
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      permit.evidenRequired
                        ? 'bg-amber-100/80 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                        : 'bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {permit.badgeText}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* TAHAP 3: Formulir Isian Card */}
      <section className="space-y-4" aria-label="Daftar formulir perizinan terpilih">
        {!selectedProject ? (
          <div className="py-14 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/30 text-center px-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 mb-3">
              <UtilityPole size={24} />
            </div>
            <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
              Belum ada proyek yang dipilih
            </p>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              Silakan pilih proyek di Langkah 1 untuk melanjutkan ke proses pemilihan izin dan pengisian update mingguan.
            </p>
          </div>
        ) : selectedPermits.length === 0 ? (
          <div className="py-14 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/30 text-center px-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 mb-3">
              <FileText size={24} />
            </div>
            <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
              Belum ada jenis izin yang dipilih
            </p>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              Centang minimal satu jenis izin pada Langkah 2 di atas untuk proyek &ldquo;{selectedProject.NamaProyek}&rdquo; guna membuka form pengisian.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <AnimatePresence>
              {PERMIT_TYPES.filter((p) => selectedPermits.includes(p.id)).map((permit) => {
                const currentData = formData[permit.id] || INITIAL_FORM_ITEM;
                const status = cardStatus[permit.id];

                return (
                  <motion.article
                    key={permit.id}
                    layout
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    {/* Header Card */}
                    <div className="flex items-start justify-between gap-3 p-5 border-b border-slate-100 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/90">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-green-100/70 dark:bg-green-950/60 text-green-700 dark:text-green-400">
                          <FileCheck2 size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                              {permit.title}
                            </h3>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                permit.evidenRequired
                                  ? 'bg-amber-100/80 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                                  : 'bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {permit.badgeText}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            Proyek: <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedProject.NamaProyek}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTogglePermit(permit.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 text-xs transition-colors"
                        title="Tutup formulir ini"
                        aria-label={`Tutup ${permit.title}`}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Notifikasi Status Simpan / Error */}
                    {status && (
                      <div
                        className={`mx-5 mt-4 flex items-center gap-2 p-3 text-xs rounded-xl border ${
                          status.type === 'success'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300'
                        }`}
                      >
                        {status.type === 'success' ? (
                          <CheckCircle2 size={16} className="flex-shrink-0" />
                        ) : (
                          <AlertCircle size={16} className="flex-shrink-0" />
                        )}
                        <span>{status.message}</span>
                      </div>
                    )}

                    {/* Form Input Perizinan */}
                    <form
                      onSubmit={(e) => handleSubmitCard(e, permit)}
                      className="p-5 flex flex-col gap-4 flex-1 justify-between"
                    >
                      <div className="space-y-4">
                        {/* 1. Field: Tahapan Saat Ini */}
                        <div>
                          <label
                            htmlFor={`tahapan-${permit.id}`}
                            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                          >
                            Tahapan Saat Ini <span className="text-red-500">*</span>
                          </label>
                          <input
                            id={`tahapan-${permit.id}`}
                            type="text"
                            required
                            placeholder="Contoh: Pengajuan berkas dan verifikasi teknis"
                            value={currentData.tahapan}
                            onChange={(e) =>
                              handleInputChange(permit.id, 'tahapan', e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-green-500/10"
                          />
                        </div>

                        {/* 2. Field: Input Dokumen Eviden */}
                        <div>
                          <label
                            htmlFor={`eviden-${permit.id}`}
                            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                          >
                            <span>Input Dokumen Eviden</span>{' '}
                            {permit.evidenRequired ? (
                              <span className="text-red-500 font-bold">* (Wajib)</span>
                            ) : (
                              <span className="text-slate-400 font-normal">(Opsional untuk KKPR)</span>
                            )}
                          </label>

                          {currentData.evidenFile ? (
                            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-green-200 bg-green-50/60 dark:border-green-900/40 dark:bg-green-950/30 text-xs">
                              <div className="flex items-center gap-2 truncate">
                                <FileCheck2 size={16} className="text-green-600 flex-shrink-0" />
                                <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
                                  {currentData.evidenFile.name}
                                </span>
                                <span className="text-[11px] text-slate-400 flex-shrink-0">
                                  ({(currentData.evidenFile.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(permit.id)}
                                className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                                title="Hapus file"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <label
                              htmlFor={`eviden-${permit.id}`}
                              className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50/40 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer transition-colors"
                            >
                              <Upload size={20} className="text-slate-400 mb-1" />
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                Pilih file eviden untuk diunggah
                              </span>
                              <span className="text-[11px] text-slate-400 mt-0.5">
                                PDF, JPG, PNG, atau ZIP (Maks. 10MB)
                              </span>
                              <input
                                id={`eviden-${permit.id}`}
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileChange(permit.id, e)}
                              />
                            </label>
                          )}
                        </div>

                        {/* 3. Field: Catatan */}
                        <div>
                          <label
                            htmlFor={`catatan-${permit.id}`}
                            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                          >
                            Catatan
                          </label>
                          <textarea
                            id={`catatan-${permit.id}`}
                            rows={3}
                            placeholder="Catatan progres, kendala lapangan, atau koordinasi dinas terkait..."
                            value={currentData.catatan}
                            onChange={(e) =>
                              handleInputChange(permit.id, 'catatan', e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-green-500/10 resize-none"
                          />
                        </div>

                        {/* 4. Field: Diisi Oleh Siapa */}
                        <div>
                          <label
                            htmlFor={`diisiOleh-${permit.id}`}
                            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                          >
                            <span className="flex items-center gap-1.5">
                              <User size={13} className="text-slate-400" />
                              Diisi Oleh Siapa <span className="text-red-500">*</span>
                            </span>
                          </label>
                          <input
                            id={`diisiOleh-${permit.id}`}
                            type="text"
                            required
                            placeholder="Contoh: Budi Santoso (PIC Perizinan)"
                            value={currentData.diisiOleh}
                            onChange={(e) =>
                              handleInputChange(permit.id, 'diisiOleh', e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-green-500/10"
                          />
                        </div>
                      </div>

                      {/* 5. Button Simpan Update Mingguan */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-sm shadow-green-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                        >
                          <Calendar size={16} />
                          <span>Simpan Update Mingguan</span>
                        </button>
                      </div>
                    </form>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>
    </main>
  );
}