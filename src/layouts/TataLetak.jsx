
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

import './TataLetak.css';

export default function TataLetak() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div
      className={`layout-container ${
        desktopSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'
      }`}
    >
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        desktopSidebarOpen={desktopSidebarOpen}
      />

      <div className="main-content">
        <Header
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          desktopSidebarOpen={desktopSidebarOpen}
          setDesktopSidebarOpen={setDesktopSidebarOpen}
        />

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
