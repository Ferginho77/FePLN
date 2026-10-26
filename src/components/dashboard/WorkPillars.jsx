import { motion } from 'framer-motion';
import { FileText, Map, Coins, Award, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export default function WorkPillars({ bidangStatsMap = {} }) {
  const navigate = useNavigate();

  const pillars = [
    {
      id: 'Perizinan',
      title: 'Perizinan',
      description: 'KKPR, Penetapan Lokasi, Lingkungan & PBG',
      icon: FileText,
      color: 'from-blue-600 to-indigo-600',
      badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      borderHover: 'hover:border-blue-400',
      path: '/anggaran', // or direct filter
    },
    {
      id: 'Pengadaan Tanah',
      title: 'Pengadaan Tanah',
      description: 'Tapak Tower SUTT & Tapak Gardu Induk (GI)',
      icon: Map,
      color: 'from-emerald-600 to-teal-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      borderHover: 'hover:border-emerald-400',
      path: '/anggaran',
    },
    {
      id: 'Kompensasi ROW',
      title: 'Kompensasi ROW',
      description: 'Right of Way & Ruang Bebas Jalur Transmisi',
      icon: Coins,
      color: 'from-amber-600 to-orange-600',
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      borderHover: 'hover:border-amber-400',
      path: '/anggaran',
    },
    {
      id: 'Sertifikasi',
      title: 'Sertifikasi',
      description: 'Penerbitan Sertipikat Tanah & Legalitas Aset',
      icon: Award,
      color: 'from-purple-600 to-pink-600',
      badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      borderHover: 'hover:border-purple-400',
      path: '/anggaran',
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Pilar Pekerjaan Utama (GARIS PLN)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitoring komprehensif 4 pilar tahapan proyek transmisi dan gardu induk
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((pillar, idx) => {
          const stats = bidangStatsMap[pillar.id] || { rencana: 0, realisasi: 0, count: 0 };
          const serapanPct = stats.rencana > 0 ? (stats.realisasi / stats.rencana) * 100 : 0;
          const Icon = pillar.icon;

          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => navigate(pillar.path)}
              className={`group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer ${pillar.borderHover}`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${pillar.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                >
                  <Icon size={20} />
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${pillar.badgeBg}`}>
                  {stats.count || 0} Item
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {pillar.title}
                  </h4>
                  <ArrowUpRight
                    size={16}
                    className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Realisasi</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {currencyFormatter.format(stats.realisasi)}
                  </span>
                </div>

                <div className="mt-2 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(serapanPct, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                  <span>Serapan</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {serapanPct.toFixed(0)}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
