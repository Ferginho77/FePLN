import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Coins, FileText, LayoutDashboard, Map, Menu, X, Banknote, Locate } from 'lucide-react';
import './Layout.css';

const navItems = [
  { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/Proyek', name: 'Proyek', icon: Locate },
  { path: '/anggaran', name: 'Anggaran', icon: Banknote },
 
];
const Bidang = [
   { path: '/Perizinan', name: 'Perizinan', icon: FileText },
   { path: '/Pengadaan Tanah', name: 'Pengadaan Tanah', icon: Map },
  { path: '/Kompensasi ROW', name: 'Kompensasi ROW', icon: Coins },
  { path: '/Sertifikasi', name: 'Sertifikasi', icon: Award },
];

function NavigationLinks({ onNavigate, id }) {
  return (
    <nav className="sidebar-nav" id={id} aria-label="Navigasi utama">
      {navItems.map(({ path, name, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={onNavigate}
        >
          <Icon className="nav-icon" aria-hidden="true" />
          <span>{name}</span>
        </NavLink>
      ))}
      <span className='text-primary font-semibold bg-blue-100 dark:bg-blue-900/50 p-2 rounded-md'>Bidang Pekerjaan</span>
       {Bidang.map(({ path, name, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={onNavigate}
        >
          <Icon className="nav-icon" aria-hidden="true" />
          <span>{name}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function Layout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className="layout-container">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              className="sidebar-overlay"
              aria-label="Tutup navigasi"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              className="sidebar mobile"
              id="mobile-navigation"
              aria-label="Navigasi utama"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            >
              <div className="sidebar-header">
                <h1 className="logo"><img src="/icon.png" alt="" className="logo-image" /> GARIS</h1>
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Tutup navigasi"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X aria-hidden="true" />
                </button>
              </div>
              <NavigationLinks onNavigate={() => setMobileMenuOpen(false)} />
              <div className="p-4 mt-auto border-t border-bg-200">
                <button className="btn-outline flex items-center justify-center gap-2 w-full text-[red] border-[red] hover:bg-red-50 dark:hover:bg-red-950/20" onClick={handleLogout}>
                  Keluar
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`sidebar desktop ${desktopSidebarOpen ? '' : 'collapsed'}`} aria-label="Navigasi utama">
        <div className="sidebar-header">
          <h1 className="logo"><img src="/icon.png" alt="" className="logo-image" /> GARIS</h1>
        </div>
        <NavigationLinks id="desktop-navigation" />
        <div className="p-4 mt-auto border-t border-bg-200 flex flex-col gap-2">
          <button className="btn-outline flex items-center justify-center gap-2 w-full text-[red] border-[red] hover:bg-red-50 dark:hover:bg-red-950/20" onClick={handleLogout}>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="mobile-header">
          <button
            className="icon-btn menu-toggle mobile-menu-toggle"
            type="button"
            aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <button
            className="icon-btn menu-toggle desktop-menu-toggle"
            type="button"
            aria-label={desktopSidebarOpen ? 'Ciutkan navigasi' : 'Buka navigasi'}
            aria-expanded={desktopSidebarOpen}
            aria-controls="desktop-navigation"
            onClick={() => setDesktopSidebarOpen((open) => !open)}
          >
            <Menu aria-hidden="true" />
          </button>
          <div className="header-brand">
            <h1 className="mobile-title">GARIS</h1>
            <span>Monitoring Proyek SUTT &amp; GI</span>
          </div>
          <span className="header-spacer" aria-hidden="true" />
        </header>
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
