import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Coins,
  FileText,
  LayoutDashboard,
  Map,
  Banknote,
  Locate,
} from "lucide-react";

const mainItems = [
  { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
  { path: "/proyek", name: "Proyek", icon: Locate },
];

const financeItems = [
  { path: "/anggaran", name: "Anggaran", icon: Banknote },
];

const workItems = [
  { path: "/perizinan", name: "Perizinan", icon: FileText },
  { path: "/pengadaan", name: "Pengadaan Tanah", icon: Map },
  { path: "/row", name: "Kompensasi ROW", icon: Coins },
  { path: "/sertifikasi", name: "Sertifikasi", icon: Award },
];

function NavigationGroup({ title, items, collapsed = false, onNavigate }) {
  return (
    <div className="sidebar-group">
      {title && (
        <div className="sidebar-group-title">
          <span>{title}</span>
        </div>
      )}

      {items.map(({ path, name, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          title={collapsed ? name : undefined}
          aria-label={collapsed ? name : undefined}
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={onNavigate}
        >
          <Icon className="nav-icon" aria-hidden="true" />
          <span className="nav-label">{name}</span>
        </NavLink>
      ))}
    </div>
  );
}

function SidebarContent({ collapsed = false, onNavigate, mobile = false }) {
  return (
    <>
      <div className="sidebar-header">
        <a
          href="/dashboard"
          className="sidebar-brand"
          aria-label="GARIS - Dashboard"
          onClick={mobile ? onNavigate : undefined}
        >
          <img src="/icon.png" alt="" className="logo-image" />
          <span className="sidebar-brand-text">
            <strong>GARIS</strong>
            <small>Monitoring Proyek SUTT &amp; GI</small>
          </span>
        </a>
      </div>

      <nav className="sidebar-nav" aria-label="Navigasi utama">
        <NavigationGroup
          items={mainItems}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />

        <NavigationGroup
          title="Keuangan"
          items={financeItems}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />

        <NavigationGroup
          title="Bidang Pekerjaan"
          items={workItems}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      </nav>
    </>
  );
}

export default function Sidebar({
  mobileMenuOpen,
  setMobileMenuOpen,
  desktopSidebarOpen,
}) {
  return (
    <>
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
              id="mobile-navigation"
              className="sidebar mobile"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                bounce: 0,
                duration: 0.3,
              }}
            >
              <SidebarContent
                mobile
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside
        id="desktop-navigation"
        className={`sidebar desktop ${desktopSidebarOpen ? "" : "collapsed"}`}
        aria-label="Navigasi desktop"
      >
        <SidebarContent collapsed={!desktopSidebarOpen} />
      </aside>
    </>
  );
}
