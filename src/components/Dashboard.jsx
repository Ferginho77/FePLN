import { UtilityPole, Map, CalendarClock} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion} from 'framer-motion';
import { GetProject } from '../api/ProjectService';
export default function Dashboard() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await GetProject();
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

return(
    <div className="dashboard">
        <div className="dashboard-header flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <SummaryCard
          title="Total Proyek"
          value={projects.length}
          subtitle={projects.filter(project => project.Jenis === "SUTT").length + " SUTT, " + projects.filter(project => project.Jenis === "GI").length + " Gardu Induk"}
          icon={<UtilityPole size={24} className="text-green-500" />}
          delay={0.1}
        />
        <SummaryCard
          title="Perlu Di Update"
          value="4"
          icon={<Map size={24} className="text-blue-500" />}
          delay={0.2}
        />
        <SummaryCard
          title="Tugas Terjadwal"
          value="5"
          subtitle="Tugas terjadwal"
          icon={<CalendarClock size={24} className="text-purple-500" />}
          delay={0.4}
        />
      </div>
      </div>
    </div>
    );
}

function SummaryCard({ title, value, subtitle, icon, delay = 0 }) {
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
        <h3 className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider truncate">{title}</h3>
        <p className="text-2xl font-bold text-gray-800 dark:text-white truncate">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">{subtitle}</p>}
      </div>
    </motion.div>
  );
}