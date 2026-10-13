import { motion } from 'framer-motion';

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03 }}
      className="p-4 rounded-xl shadow-sm flex items-center gap-4 border border-bg-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div className="overflow-hidden">
        <h3 className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider truncate">
          {title}
        </h3>

        <p className="text-2xl font-bold text-gray-800 dark:text-white truncate">
          {value}
        </p>

        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
