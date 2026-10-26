import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash,
  Pencil,
  MapPin,
  UtilityPole,
  Plus,
  X,
  Loader2,
  AlertCircle,
  Layers,
  FileText,
} from 'lucide-react';
import { GetProject, CreateProject, DeleteProject, UpdateProject } from '../api/ProjectService';

const PERIZINAN_OPTIONS = [
  'KKPR',
  'Penetapan Lokasi',
  'Lingkungan',
  'PPKH',
  'PBG',
];

const JENIS_OPTIONS = [
  { value: 'SUTT', label: 'SUTT (Saluran Udara Tegangan Tinggi)' },
  { value: 'GI', label: 'GI (Gardu Induk)' },
];

const INITIAL_FORM = {
  NamaProyek: '',
  Jenis: '',
  Perizinan: '',
};

export default function Proyek() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await GetProject();
      setProjects(response.data || response || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Gagal memuat daftar proyek. Pastikan server API aktif.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleOpenAddModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setModalMode('edit');
    setEditingId(project.ProyekId || project.id);
    setFormData({
      NamaProyek: project.NamaProyek || '',
      Jenis: project.Jenis || '',
      Perizinan: project.Perizinan || '',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setEditingId(null);
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

    if (!formData.NamaProyek.trim()) {
      setModalError('Nama proyek wajib diisi.');
      return;
    }

    if (!formData.Jenis) {
      setModalError('Pilih jenis proyek.');
      return;
    }

    // Pastikan nilai perizinan sesuai dengan daftar enum
    if (!PERIZINAN_OPTIONS.includes(formData.Perizinan)) {
      setModalError('Status perizinan tidak valid.');
      return;
    }

    setSubmitting(true);
    setModalError('');

    try {
      const payload = {
        NamaProyek: formData.NamaProyek.trim(),
        Jenis: formData.Jenis,
        Perizinan: formData.Perizinan,
      };

      if (modalMode === 'edit') {
        await UpdateProject(editingId, payload);
      } else {
        await CreateProject(payload);
      }

      // Refresh data proyek setelah berhasil disimpan
      await fetchProjects();
      handleCloseModal();
    } catch (err) {
      console.error(modalMode === 'edit' ? 'Error updating project:' : 'Error creating project:', err);
      setModalError(
        err.message || `Gagal ${modalMode === 'edit' ? 'memperbarui' : 'menyimpan'} proyek. Silakan coba kembali.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProyek = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;
    try {
      await DeleteProject(id);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Gagal menghapus proyek. Silakan coba kembali.');
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 sm:gap-7 text-slate-800 dark:text-slate-200">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-0 sm:pt-1 pb-2">
        <div>
          <p className="mb-2 text-[0.7rem] font-bold tracking-[0.14em] text-green-700 dark:text-green-400 uppercase">
            MONITORING INFRASTRUKTUR
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.15]">
            Daftar Proyek
          </h1>
          <p className="mt-[0.6rem] max-w-lg text-[0.85rem] sm:text-[0.925rem] leading-relaxed text-slate-500 dark:text-slate-400">
            Informasi ringkas progres pembangunan SUTT dan gardu induk.
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-sm shadow-green-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          >
            <Plus size={18} />
            <span>Tambah Proyek</span>
          </button>
        </div>
      </header>

      {/* Pesan Error Fetch */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchProjects}
            className="font-medium underline hover:text-red-900 dark:hover:text-red-100"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Grid Proyek */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        aria-label="Daftar informasi proyek"
      >
        {loading && projects.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-3 text-green-600" size={32} />
            <p className="text-sm font-medium">Memuat data proyek...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400">
            <UtilityPole size={40} className="mb-2 stroke-1 text-slate-400" />
            <p className="font-semibold text-slate-600 dark:text-slate-300">
              Belum ada proyek terdaftar
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Klik tombol &ldquo;Tambah Proyek&rdquo; untuk menambahkan proyek baru.
            </p>
          </div>
        ) : (
          projects.map((project, index) => (
            <motion.article
              key={project.ProyekId || project.id || index}
              className="flex min-w-0 flex-col gap-[1.125rem] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.25,
                delay: index * 0.05,
              }}
            >
              <div className="flex items-start justify-start gap-3">
                <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl border border-green-100 dark:border-green-800/40 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400">
                  <UtilityPole size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="inline-block text-[0.68rem] font-semibold uppercase tracking-wider text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50 px-2 py-0.5 rounded-md">
                    {project.Jenis || 'PROYEK'}
                  </span>

                  <h2 className="mt-1 text-[0.95rem] font-semibold leading-[1.45] text-slate-800 dark:text-slate-100">
                    {project.NamaProyek}
                  </h2>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditModal(project);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 dark:hover:text-amber-400 transition-colors"
                    title="Edit Proyek"
                    aria-label={`Edit ${project.NamaProyek}`}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if(window.confirm(`Apakah anda yakin ingin menghapus ${project.NamaProyek}?`)){
                        handleDeleteProyek(project.ProyekId || project.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
                    title="Hapus Proyek"
                    aria-label={`Hapus ${project.NamaProyek}`}
                  >
                    <Trash size={15} />
                  </button>
                </div>
              </div>

              <div className="grid gap-[0.65rem] border-y border-slate-100 dark:border-slate-700/60 py-[0.875rem]">
                <span className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin size={15} className="text-slate-400 flex-shrink-0" />
                  <span className="truncate">{project.Perizinan || '—'}</span>
                </span>
              </div>
            </motion.article>
          ))
        )}
      </section>

      {/* Pop-up Modal Form Tambah / Edit Proyek */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Backdrop Blur Overlay */}
            <motion.div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            />

            {/* Modal Dialog Content */}
            <motion.div
              className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-2xl z-10"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400">
                    {modalMode === 'edit' ? <Pencil size={18} /> : <UtilityPole size={20} />}
                  </div>
                  <div>
                    <h3
                      id="modal-title"
                      className="text-lg font-bold text-slate-900 dark:text-slate-50 leading-tight"
                    >
                      {modalMode === 'edit' ? 'Edit Proyek' : 'Tambah Proyek Baru'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {modalMode === 'edit'
                        ? 'Perbarui informasi data proyek di bawah ini'
                        : 'Lengkapi data proyek di bawah ini'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
                  aria-label="Tutup modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Error Message inside Modal */}
              {modalError && (
                <div className="mt-4 flex items-center gap-2 p-3 text-xs rounded-xl border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Form Input Data Proyek */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Field: Nama Proyek */}
                <div>
                  <label
                    htmlFor="NamaProyek"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Nama Proyek <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="NamaProyek"
                    name="NamaProyek"
                    type="text"
                    required
                    placeholder="Contoh: SUTT 150 kV Payakumbuh - Koto Panjang"
                    value={formData.NamaProyek}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-green-500/10"
                  />
                </div>

                {/* Field: Jenis Proyek */}
                <div>
                  <label
                    htmlFor="Jenis"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    <span className="flex items-center gap-1.5">
                      <Layers size={14} className="text-slate-400" />
                      Jenis Proyek <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <select
                    id="Jenis"
                    name="Jenis"
                    required
                    value={formData.Jenis}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-green-500/10"
                  >
                    <option value="">Pilih Jenis Proyek</option>
                    {JENIS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field: Perizinan */}
                <div>
                  <label
                    htmlFor="Perizinan"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText size={14} className="text-slate-400" />
                      Status / Keterangan Perizinan <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <select   
                    id="Perizinan"
                    name="Perizinan"
                    required
                    value={formData.Perizinan}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none transition focus:border-green-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-green-500/10"
                  >
                    <option value="">Pilih Status Perizinan</option>
                    {PERIZINAN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Keterangan status perizinan atau lokasi administrasi proyek.
                  </p>
                </div>

                {/* Modal Footer / Action Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                  >
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    <span>
                      {submitting
                        ? modalMode === 'edit'
                          ? 'Memperbarui...'
                          : 'Menyimpan...'
                        : modalMode === 'edit'
                        ? 'Simpan Perubahan'
                        : 'Simpan Proyek'}
                    </span>
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