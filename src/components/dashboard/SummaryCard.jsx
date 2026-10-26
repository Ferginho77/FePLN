import { motion } from 'framer-motion';

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  badge,
  badgeType = 'neutral', // 'success', 'warning', 'info', 'neutral'
  progress, // number 0-100 (optional)
  colorVariant = 'blue', // 'blue', 'green', 'amber', 'purple', 'cyan'
  delay = 0,
  onClick,
}) {
  const badgeColors = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
    info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const iconBgStyles = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40',
    green: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/40',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/40',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/40',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-800/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-lg transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 truncate">
              {title}
            </h3>
            {badge && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColors[badgeType] || badgeColors.neutral}`}
              >
                {badge}
              </span>
            )}
          </div>

          <p className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
            {value}
          </p>

          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5 truncate">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 ${
            iconBgStyles[colorVariant] || iconBgStyles.blue
          }`}
        >
          {icon}
        </div>
      </div>

      {typeof progress === 'number' && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-slate-500 dark:text-slate-400">Tingkat Penyerapan</span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.8, delay: delay + 0.2 }}
              className={`h-full rounded-full ${
                progress >= 85
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : progress >= 50
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                  : 'bg-gradient-to-r from-amber-500 to-orange-400'
              }`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
