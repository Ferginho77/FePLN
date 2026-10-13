import { useEffect, useState } from 'react';
import { UtilityPole, Map, CalendarClock } from 'lucide-react';

import { GetProject } from '../api/ProjectService';
import SummaryCard from '../components/dashboard/SummaryCard';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await GetProject();
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const totalSUTT = projects.filter(
    (project) => project.Jenis === 'SUTT'
  ).length;

  const totalGI = projects.filter(
    (project) => project.Jenis === 'GI'
  ).length;

  const totalPembangkit = projects.filter(
    (project) => project.Jenis === 'Pembangkit'
  ).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 w-full">
          <SummaryCard
            title="Total Proyek"
            value={projects.length}
            subtitle={`${totalSUTT} SUTT, ${totalGI} Gardu Induk, ${totalPembangkit} Pembangkit`}
            icon={
              <UtilityPole
                size={24}
                className="text-green-500"
                aria-hidden="true"
              />
            }
            delay={0.1}
          />

          <SummaryCard
            title="Perlu Di Update"
            value="4"
            icon={
              <Map
                size={24}
                className="text-blue-500"
                aria-hidden="true"
              />
            }
            delay={0.2}
          />

          <SummaryCard
            title="Tugas Terjadwal"
            value="5"
            subtitle="Tugas terjadwal"
            icon={
              <CalendarClock
                size={24}
                className="text-purple-500"
                aria-hidden="true"
              />
            }
            delay={0.4}
          />
        </div>
      </div>
    </div>
  );
}
