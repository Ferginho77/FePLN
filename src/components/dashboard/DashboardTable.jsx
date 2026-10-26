import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ExternalLink,
  UtilityPole,
  Banknote,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export default function DashboardTable({
  projects = [],
  anggaran = [],
  loading = false,
}) {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'anggaran'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Filter Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        (p.NamaProyek || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.Perizinan || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = filterType === 'ALL' || p.Jenis === filterType;
      return matchSearch && matchFilter;
    });
  }, [projects, searchQuery, filterType]);

  // Filter Anggaran
  const filteredAnggaran = useMemo(() => {
    return anggaran.filter((a) => {
      const matchSearch =
        (a.NamaProyek || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.Tahapan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.Bidang || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = filterType === 'ALL' || a.Bidang === filterType;
      return matchSearch && matchFilter;
    });
  }, [anggaran, searchQuery, filterType]);

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-5 lg:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => {
                setActiveTab('projects');
                setFilterType('ALL');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === 'projects'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <UtilityPole size={15} />
              Proyek Aktif ({projects.length})
            </button>

            <button
              onClick={() => {
                setActiveTab('anggaran');
                setFilterType('ALL');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === 'anggaran'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Banknote size={15} />
              Transaksi Anggaran ({anggaran.length})
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeTab === 'projects'
              ? 'Daftar master proyek transmisi dan gardu induk terkini'
              : 'Daftar alokasi pagu dan realisasi belanja anggaran'}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] flex-1 sm:flex-none">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={
                activeTab === 'projects' ? 'Cari nama proyek...' : 'Cari tahapan / bidang...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          {activeTab === 'projects' ? (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">Semua Jenis</option>
              <option value="SUTT">SUTT</option>
              <option value="GI">Gardu Induk (GI)</option>
              <option value="Pembangkit">Pembangkit</option>
            </select>
          ) : (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">Semua Bidang</option>
              <option value="Perizinan">Perizinan</option>
              <option value="Pengadaan Tanah">Pengadaan Tanah</option>
              <option value="Kompensasi ROW">Kompensasi ROW</option>
              <option value="Sertifikasi">Sertifikasi</option>
            </select>
          )}

          <Link
            to={activeTab === 'projects' ? '/proyek' : '/anggaran'}
            className="p-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-1 shrink-0"
            title="Buka halaman penuh"
          >
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'projects' ? (
            <motion.table
              key="projects-table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full text-left border-collapse"
            >
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3 px-5">Nama Proyek</th>
                  <th className="py-3 px-5">Jenis Konstruksi</th>
                  <th className="py-3 px-5">Status Perizinan</th>
                  <th className="py-3 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                {filteredProjects.slice(0, 6).map((project, idx) => (
                  <tr
                    key={project.id || project.ProyekId || idx}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-white">
                      {project.NamaProyek || '—'}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          project.Jenis === 'SUTT'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                            : project.Jenis === 'GI'
                            ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300'
                        }`}
                      >
                        {project.Jenis || 'Lainnya'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>{project.Perizinan || 'Sedang Diproses'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        to="/proyek"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        Kelola
                        <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      {loading ? 'Memuat data proyek...' : 'Tidak ada data proyek yang sesuai kriteria.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </motion.table>
          ) : (
            <motion.table
              key="anggaran-table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full text-left border-collapse"
            >
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3 px-5">Proyek Terkait</th>
                  <th className="py-3 px-5">Bidang</th>
                  <th className="py-3 px-5">Tahapan</th>
                  <th className="py-3 px-5">Rencana</th>
                  <th className="py-3 px-5">Realisasi</th>
                  <th className="py-3 px-5">Serapan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                {filteredAnggaran.slice(0, 6).map((item, idx) => {
                  const pct =
                    Number(item.RencanaAnggaran) > 0
                      ? (Number(item.Realisasi || 0) / Number(item.RencanaAnggaran)) * 100
                      : 0;

                  return (
                    <tr
                      key={item.id || item.AnggaranId || idx}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-white">
                        {item.NamaProyek || '—'}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {item.Bidang || '—'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400 truncate max-w-[160px]">
                        {item.Tahapan || '—'}
                      </td>
                      <td className="py-3.5 px-5 font-medium">
                        {currencyFormatter.format(Number(item.RencanaAnggaran || 0))}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">
                        {currencyFormatter.format(Number(item.Realisasi || 0))}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pct >= 80 ? 'bg-emerald-500' : pct >= 40 ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            {pct.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredAnggaran.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      {loading ? 'Memuat data anggaran...' : 'Tidak ada transaksi anggaran yang sesuai.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </motion.table>
          )}
        </AnimatePresence>
      </div>

      {/* Footer link */}
      <div className="p-3.5 bg-slate-50/60 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Menampilkan maksimal 6 data terbaru dari sistem GARIS PLN
        </span>
        <Link
          to={activeTab === 'projects' ? '/proyek' : '/anggaran'}
          className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 group"
        >
          Lihat Semua Data {activeTab === 'projects' ? 'Proyek' : 'Anggaran'}
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
