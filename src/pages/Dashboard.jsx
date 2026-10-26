import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  UtilityPole,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { GetProject } from '../api/ProjectService';
import { GetAnggaran } from '../api/AnggaranService';

import SummaryCard from '../components/dashboard/SummaryCard';
import BudgetBreakdown from '../components/dashboard/BudgetBreakdown';
import ProjectDistribution from '../components/dashboard/ProjectDistribution';
import WorkPillars from '../components/dashboard/WorkPillars';
import DashboardTable from '../components/dashboard/DashboardTable';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export default function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [anggaran, setAnggaran] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('ALL');

  // Load Data
  const loadDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const [projRes, anggRes] = await Promise.allSettled([
        GetProject(),
        GetAnggaran(),
      ]);

      let rawProjects = [];
      if (projRes.status === 'fulfilled') {
        const val = projRes.value;
        rawProjects = Array.isArray(val) ? val : val?.data || [];
      } else {
        console.warn('Gagal memuat proyek:', projRes.reason);
      }

      let rawAnggaran = [];
      if (anggRes.status === 'fulfilled') {
        const val = anggRes.value;
        rawAnggaran = Array.isArray(val) ? val : val?.data || [];
      } else {
        console.warn('Gagal memuat anggaran:', anggRes.reason);
      }

      // Buat map project
      const pMap = {};
      rawProjects.forEach((p) => {
        const id = p.ProyekId ?? p.proyekId ?? p.id;
        const name = p.NamaProyek ?? p.namaProyek ?? p.nama ?? '';
        if (id !== undefined && id !== null) {
          pMap[String(id)] = name;
        }
      });

      // Normalisasi anggaran dengan NamaProyek
      const normalizedAnggaran = rawAnggaran.map((item) => ({
        ...item,
        id: item.id ?? item.AnggaranId ?? item.Id,
        NamaProyek:
          (item.ProyekId !== undefined && item.ProyekId !== null
            ? pMap[String(item.ProyekId)]
            : undefined) ??
          item.NamaProyek ??
          item.namaProyek ??
          '—',
      }));

      setProjects(rawProjects);
      setAnggaran(normalizedAnggaran);
    } catch (err) {
      console.error('Error dashboard data:', err);
      setError('Sebagian data gagal disinkronkan dari server backend.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Filtered data based on selected project
  const filteredAnggaran = useMemo(() => {
    if (selectedProjectId === 'ALL') return anggaran;
    return anggaran.filter((a) => String(a.ProyekId) === String(selectedProjectId));
  }, [anggaran, selectedProjectId]);

  // Project Types count
  const suttCount = projects.filter((p) => p.Jenis === 'SUTT').length;
  const giCount = projects.filter((p) => p.Jenis === 'GI').length;
  const pembangkitCount = projects.filter((p) => p.Jenis === 'Pembangkit').length;

  // Financial Stats
  const totalRencana = useMemo(() => {
    return filteredAnggaran.reduce(
      (sum, item) => sum + Number(item.RencanaAnggaran || 0),
      0
    );
  }, [filteredAnggaran]);

  const totalRealisasi = useMemo(() => {
    return filteredAnggaran.reduce(
      (sum, item) => sum + Number(item.Realisasi || 0),
      0
    );
  }, [filteredAnggaran]);

  const sisaAnggaran = Math.max(0, totalRencana - totalRealisasi);
  const serapanPercentage = totalRencana > 0 ? (totalRealisasi / totalRencana) * 100 : 0;

  // Bidang Stats aggregation
  const bidangStatsMap = useMemo(() => {
    const map = {
      Perizinan: { rencana: 0, realisasi: 0, count: 0 },
      'Pengadaan Tanah': { rencana: 0, realisasi: 0, count: 0 },
      'Kompensasi ROW': { rencana: 0, realisasi: 0, count: 0 },
      Sertifikasi: { rencana: 0, realisasi: 0, count: 0 },
    };

    filteredAnggaran.forEach((item) => {
      const bidangKey = item.Bidang?.trim();
      if (bidangKey && map[bidangKey]) {
        map[bidangKey].rencana += Number(item.RencanaAnggaran || 0);
        map[bidangKey].realisasi += Number(item.Realisasi || 0);
        map[bidangKey].count += 1;
      }
    });

    return map;
  }, [filteredAnggaran]);

  const bidangStatsArray = useMemo(() => {
    return Object.entries(bidangStatsMap).map(([bidang, stats]) => ({
      bidang,
      ...stats,
    }));
  }, [bidangStatsMap]);

  // Perizinan Matrix aggregation
  const perizinanStats = useMemo(() => {
    const stats = {};
    projects.forEach((p) => {
      const izin = p.Perizinan?.trim() || 'Belum Diidentifikasi';
      stats[izin] = (stats[izin] || 0) + 1;
    });
    return stats;
  }, [projects]);

  // Tanggal Hari Ini dalam Bahasa Indonesia
  const currentDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-[#2A7B9B] via-[#57C785] to-[#EDDD53] rounded-2xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-cyan-200 border border-white/10 mb-3">
              <Calendar size={13} />
              <span>{currentDate}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
             Dashboard Monitoring Proyek (GARIS)
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
             Ringkasan capaian bidang pekerjaan, lintas seluruh proyek SUTT dan GI.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => loadDashboardData(true)}
              disabled={refreshing || loading}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 backdrop-blur-sm border border-white/10 disabled:opacity-50"
              title="Perbarui Data"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <Link
              to="/proyek"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#10243a] text-xs font-bold transition-all shadow-md flex items-center gap-2 group"
            >
              <Plus size={15} className="text-blue-600 group-hover:scale-110 transition-transform" />
              <span>Input Proyek</span>
            </Link>

            <Link
              to="/anggaran"
              className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-900 text-xs font-extrabold transition-all shadow-md flex items-center gap-2 group"
            >
              <Wallet size={15} className="group-hover:scale-110 transition-transform" />
              <span>Input Anggaran</span>
            </Link>
          </div>
        </div>

        {/* Global Filter by Specific Project */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-cyan-100">
            <span className="font-semibold">Filter Fokus Proyek:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-white/15 border border-white/20 rounded-lg px-3 py-1.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-cyan-300 backdrop-blur-md cursor-pointer"
            >
              <option value="ALL" className="text-slate-900">
                Semua Proyek (Konsolidasi Keseluruhan)
              </option>
              {projects.map((p) => {
                const id = p.ProyekId ?? p.proyekId ?? p.id;
                return (
                  <option key={id} value={id} className="text-slate-900">
                    {p.NamaProyek || `Proyek #${id}`} ({p.Jenis})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-amber-800 dark:text-amber-300 text-xs">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Proyek"
          value={projects.length}
          subtitle={`${suttCount} SUTT, ${giCount} GI, ${pembangkitCount} Pembangkit`}
          badgeType="info"
          colorVariant="cyan"
          icon={<UtilityPole size={24} />}
          onClick={() => navigate('/proyek')}
          delay={0.05}
        />

        <SummaryCard
          title="Pagu Rencana Anggaran"
          value={currencyFormatter.format(totalRencana)}
          subtitle={
            selectedProjectId === 'ALL'
              ? 'Akumulasi seluruh proyek'
              : 'Pagu proyek terpilih'
          }
          badgeType="neutral"
          colorVariant="blue"
          icon={<Wallet size={24} />}
          onClick={() => navigate('/anggaran')}
          delay={0.1}
        />

        <SummaryCard
          title="Total Realisasi Serapan"
          value={currencyFormatter.format(totalRealisasi)}
          subtitle={`Terserap ${serapanPercentage.toFixed(1)}% dari pagu`}
          progress={serapanPercentage}
          badgeType={serapanPercentage >= 80 ? 'success' : 'warning'}
          colorVariant="green"
          icon={<TrendingUp size={24} />}
          onClick={() => navigate('/anggaran')}
          delay={0.15}
        />

        <SummaryCard
          title="Sisa Anggaran Tersedia"
          value={currencyFormatter.format(sisaAnggaran)}
          subtitle="Cadangan alokasi belanja"
          badgeType="neutral"
          colorVariant="amber"
          icon={<CheckCircle2 size={24} />}
          onClick={() => navigate('/anggaran')}
          delay={0.2}
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <BudgetBreakdown
            bidangStats={bidangStatsArray}
            totalRencana={totalRencana}
            totalRealisasi={totalRealisasi}
          />
        </div>

        <div className="lg:col-span-5">
          <ProjectDistribution
            totalProjects={projects.length}
            suttCount={suttCount}
            giCount={giCount}
            pembangkitCount={pembangkitCount}
            perizinanStats={perizinanStats}
          />
        </div>
      </div>

      {/* 4 Core Pillars of Work */}
      <WorkPillars bidangStatsMap={bidangStatsMap} />

      {/* Interactive Tables: Projects & Budget */}
      <DashboardTable
        projects={projects}
        anggaran={filteredAnggaran}
        loading={loading}
      />
    </div>
  );
}
