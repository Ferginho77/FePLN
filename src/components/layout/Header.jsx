import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  UserRound,
  LogOut,
} from 'lucide-react';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/Proyek': 'Proyek',
  '/anggaran': 'Anggaran',
  '/Persekot Dinas': 'Persekot Dinas',
  '/Perizinan': 'Perizinan',
  '/Pengadaan Tanah': 'Pengadaan Tanah',
  '/Kompensasi ROW': 'Kompensasi ROW',
  '/Sertifikasi': 'Sertifikasi',
};

export default function Header({
  mobileMenuOpen,
  setMobileMenuOpen,
  desktopSidebarOpen,
  setDesktopSidebarOpen,
}) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle =
    pageTitles[location.pathname] ??
    location.pathname.split('/').filter(Boolean).pop() ??
    'Dashboard';

  useEffect(() => {
    if (!accountMenuOpen) return;

    const handlePointerDown = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [accountMenuOpen]);

  useEffect(() => {
    setAccountMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAccountMenuOpen(false);
    navigate('/login', { replace: true });
  };

 return (
  <header className="app-header">
    <div className="header-left">
      {/* Hamburger desktop dan mobile di sebelah kiri judul */}
      <button
        type="button"
        className="icon-btn desktop-menu-toggle"
        aria-label={
          desktopSidebarOpen ? 'Ciutkan navigasi' : 'Buka navigasi'
        }
        aria-expanded={desktopSidebarOpen}
        aria-controls="desktop-navigation"
        onClick={() => setDesktopSidebarOpen((open) => !open)}
      >
        <Menu aria-hidden="true" />
      </button>

      <button
        type="button"
        className="icon-btn mobile-menu-toggle"
        aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMobileMenuOpen((open) => !open)}
      >
        {mobileMenuOpen ? (
          <X aria-hidden="true" />
        ) : (
          <Menu aria-hidden="true" />
        )}
      </button>

      <div className="page-heading">
        <h1 className="page-title">{pageTitle}</h1>
        <p className="page-subtitle">
          Monitoring Proyek SUTT &amp; GI
        </p>
      </div>
    </div>

    <div className="header-right">
      {/* Pertahankan account-menu-wrapper beserta dropdown akun
          dan tombol Logout yang sudah ada di sini. */}


        {/* Tombol drawer tetap tersedia di mobile, tetapi bukan di kiri judul */}
        <button
          type="button"
          className="icon-btn mobile-menu-toggle"
          aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
          title={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
        >
          {mobileMenuOpen ? (
            <X aria-hidden="true" />
          ) : (
            <Menu aria-hidden="true" />
          )}
        </button>

        <div className="account-menu-wrapper" ref={accountMenuRef}>
          <button
            type="button"
            className="account-trigger"
            aria-label="Menu Akun Pengguna"
            aria-expanded={accountMenuOpen}
            aria-haspopup="menu"
            onClick={() => setAccountMenuOpen((open) => !open)}
          >
            <UserRound className="account-trigger-icon" aria-hidden="true" />

            <span className="account-name">Akun Pengguna</span>

            <ChevronDown
              className={`account-chevron ${
                accountMenuOpen ? 'is-open' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {accountMenuOpen && (
            <div className="account-dropdown" role="menu">
              <div className="account-dropdown-heading">
                <span className="account-avatar">
                  <UserRound aria-hidden="true" />
                </span>

                <span className="account-dropdown-name">
                  Akun Pengguna
                </span>
              </div>

              <button
                type="button"
                className="account-logout"
                role="menuitem"
                onClick={handleLogout}
              >
                <LogOut aria-hidden="true" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}