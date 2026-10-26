import { motion } from 'framer-motion';
import { UtilityPole, Layers, CheckCircle2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjectDistribution({
  totalProjects = 0,
  suttCount = 0,
  giCount = 0,
  pembangkitCount = 0,
  perizinanStats = {},
}) {
  const suttPct = totalProjects > 0 ? (suttCount / totalProjects) * 100 : 0;
  const giPct = totalProjects > 0 ? (giCount / totalProjects) * 100 : 0;
  const pembPct = totalProjects > 0 ? (pembangkitCount / totalProjects) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Distribusi & Kesiapan Proyek
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Proporsi Infrastruktur Transmisi & Perizinan
              </p>
            </div>
          </div>
          <Link
            to="/proyek"
            className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 flex items-center gap-1 group py-1 px-2.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-colors"
          >
            Lihat Proyek
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Multi-segment distribution bar */}
        <div className="mt-5">
          <div className="flex justify-between items-center text-xs font-semibold mb-2 text-slate-600 dark:text-slate-300">
            <span>Komposisi Tipe Konstruksi</span>
            <span className="text-slate-400 font-normal">{totalProjects} Total Proyek</span>
          </div>

          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1 p-0.5">
            {suttCount > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${suttPct}%` }}
                transition={{ duration: 0.6 }}
                className="bg-blue-600 rounded-full h-full"
                title={`SUTT: ${suttCount} (${suttPct.toFixed(1)}%)`}
              />
            )}
            {giCount > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${giPct}%` }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-cyan-500 rounded-full h-full"
                title={`Gardu Induk: ${giCount} (${giPct.toFixed(1)}%)`}
              />
            )}
            {pembangkitCount > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pembPct}%` }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-emerald-500 rounded-full h-full"
                title={`Pembangkit: ${pembangkitCount} (${pembPct.toFixed(1)}%)`}
              />
            )}
            {totalProjects === 0 && (
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-full" />
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 mt-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100/60 dark:border-blue-900/40">
              <div className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>SUTT</span>
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {suttCount} <span className="text-[11px] font-normal text-slate-400">({suttPct.toFixed(0)}%)</span>
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-100/60 dark:border-cyan-900/40">
              <div className="flex items-center gap-1.5 text-xs text-cyan-700 dark:text-cyan-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                <span>Gardu Induk</span>
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {giCount} <span className="text-[11px] font-normal text-slate-400">({giPct.toFixed(0)}%)</span>
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100/60 dark:border-emerald-900/40">
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Pembangkit</span>
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {pembangkitCount} <span className="text-[11px] font-normal text-slate-400">({pembPct.toFixed(0)}%)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Perizinan Status Matrix */}
        <div className="mt-5">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-cyan-500" />
            Distribusi Kelengkapan Perizinan
          </h4>

          <div className="space-y-2">
            {Object.entries(perizinanStats).length > 0 ? (
              Object.entries(perizinanStats).map(([status, count], i) => (
                <div
                  key={status}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{status}</span>
                  </div>
                  <span className="font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200">
                    {count} Proyek
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-slate-400 py-3">
                Belum ada data perizinan.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <UtilityPole size={14} className="text-cyan-500" />
          Aset Transmisi & Distribusi
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Status Real-time
        </span>
      </div>
    </div>
  );
}
