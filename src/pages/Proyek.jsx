import { ArrowUpRight, CalendarDays, MapPin, UtilityPole } from 'lucide-react';
import { motion } from 'framer-motion';
import { GetProject } from '../api/ProjectService';
import { useEffect, useState } from 'react';

export default function Proyek() {
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

        <div className="flex flex-shrink-0 items-center gap-[0.5rem] sm:gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 sm:px-4 sm:py-[0.7rem] shadow-sm">
         
            <button className="text-white hover:bg-white-100 focus:outline-none focus:ring-2 focus:ring-white-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
              Tambah Proyek
            </button>
          
        </div>
      </header>

      {/* Grid Proyek */}
     <section
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
  aria-label="Daftar informasi proyek"
>
  {projects.map((project, index) => (
    <motion.article
      key={project.ProyekId}
      className="flex min-w-0 flex-col gap-[1.125rem] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 sm:p-5 shadow-sm"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: index * 0.05,
      }}
    >
      <div className="flex items-start justify-start gap-3">
        <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl border border-green-100 bg-green-50 text-green-700">
          <UtilityPole size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-slate-500">
            {project.Jenis}
          </span>

          <h2 className="mt-1 text-[0.95rem] font-semibold leading-[1.45]">
            {project.NamaProyek}
          </h2>
        </div>

        <ArrowUpRight
          className="mt-1 flex-shrink-0 text-slate-400"
          size={18}
        />
      </div>

      <div className="grid gap-[0.65rem] border-y border-slate-100 py-[0.875rem]">
        <span className="inline-flex items-center gap-2 text-xs text-slate-500">
          <MapPin size={15} />
          {project.Perizinan}
        </span>
      </div>
    </motion.article>
  ))}
</section>
    </main>
  );
}