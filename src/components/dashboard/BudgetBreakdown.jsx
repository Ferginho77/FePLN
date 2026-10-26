import { motion } from 'framer-motion';
import { Wallet, TrendingUp, ArrowRight, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export default function BudgetBreakdown({ bidangStats = [], totalRencana = 0, totalRealisasi = 0 }) {
  const overallPercentage = totalRencana > 0 ? (totalRealisasi / totalRencana) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <PieChart size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Penyerapan Anggaran per Bidang
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Alokasi Pagu vs Realisasi Keuangan PLN
              </p>
            </div>
          </div>
          <Link
            to="/anggaran"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 group py-1 px-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            Kelola Anggaran
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Overall Progress Banner */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Realisasi Akumulatif</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {currencyFormatter.format(totalRealisasi)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pagu Total</span>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {currencyFormatter.format(totalRencana)}
              </p>
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(overallPercentage, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
            />
          </div>
          <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Rasio Penyerapan Keseluruhan</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{overallPercentage.toFixed(1)}%</span>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="mt-5 space-y-4">
          {bidangStats.map((item, idx) => {
            const pct = item.rencana > 0 ? (item.realisasi / item.rencana) * 100 : 0;
            return (
              <div key={item.bidang || idx} className="group">
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.bidang}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400">
                      {currencyFormatter.format(item.realisasi)} / {currencyFormatter.format(item.rencana)}
                    </span>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                      pct >= 80
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : pct >= 40
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                    }`}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct, 100)}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className={`h-full rounded-full ${
                      pct >= 80
                        ? 'bg-emerald-500'
                        : pct >= 40
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}

          {bidangStats.length === 0 && (
            <p className="text-center text-xs text-slate-400 py-6">
              Belum ada data anggaran yang tercatat.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <TrendingUp size={14} className="text-emerald-500" />
          Update berkala dari transaksi anggaran
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {bidangStats.length} Bidang Terdaftar
        </span>
      </div>
    </div>
  );
}
