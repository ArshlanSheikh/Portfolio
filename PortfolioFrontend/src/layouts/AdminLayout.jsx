import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Sparkles,
  BriefcaseBusiness,
  Layers,
  GraduationCap,
  Award,
  Trophy,
  MessageSquareQuote,
  BookOpenText,
  Mail,
  Image as ImageIcon,
  Sliders,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import styles from './AdminLayout.module.css';

const navSections = [
  {
    title: 'OVERVIEW',
    items: [
      { title: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
      { title: 'Profile & Bio', path: '/admin/profile', icon: User },
    ],
  },
  {
    title: 'CONTENT',
    items: [
      { title: 'Projects', path: '/admin/projects', icon: FolderKanban },
      { title: 'Skills', path: '/admin/skills', icon: Sparkles },
      { title: 'Experience', path: '/admin/experience', icon: BriefcaseBusiness },
      { title: 'Services', path: '/admin/services', icon: Layers },
      { title: 'Education', path: '/admin/education', icon: GraduationCap },
      { title: 'Certifications', path: '/admin/certifications', icon: Award },
      { title: 'Achievements', path: '/admin/achievements', icon: Trophy },
      { title: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
      { title: 'Blog Articles', path: '/admin/blog', icon: BookOpenText },
    ],
  },
  {
    title: 'COMMUNICATION & ASSETS',
    items: [
      { title: 'Inquiries', path: '/admin/inquiries', icon: Mail },
      { title: 'Media Library', path: '/admin/media', icon: ImageIcon },
      { title: 'Appearance & SEO', path: '/admin/settings', icon: Sliders },
    ],
  },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Extract current section title for breadcrumbs
  const currentPath = location.pathname;
  let currentTitle = 'Dashboard';
  for (const section of navSections) {
    for (const item of section.items) {
      if (item.path === currentPath || (!item.end && currentPath.startsWith(item.path))) {
        currentTitle = item.title;
        break;
      }
    }
  }

  return (
    <div className={styles.adminShell}>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          mobileMenuOpen ? styles.sidebarOpen : ''
        }`}
      >
        <div className={styles.sidebarHeader}>
          <Link to="/admin" className={styles.brand} onClick={() => setMobileMenuOpen(false)}>
            <span className={styles.brandBadge}>AS</span>
            <div>
              <span className={styles.brandName}>Portfolio CMS</span>
              <small className={styles.brandTag}>ADMIN CONSOLE</small>
            </div>
          </Link>
          <button
            type="button"
            className={styles.mobileCloseBtn}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.navScroller}>
          {navSections.map((section) => (
            <div key={section.title} className={styles.navGroup}>
              <p className={styles.navLabel}>{section.title}</p>
              <nav aria-label={section.title}>
                {section.items.map(({ title, path, icon: Icon, end }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.active : ''}`
                    }
                  >
                    <Icon size={16} />
                    <span>{title}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className={styles.userInfo}>
              <strong>{user?.name || 'Administrator'}</strong>
              <small>{user?.email || 'admin@portfolio.local'}</small>
            </div>
          </div>

          <div className={styles.footerActions}>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className={styles.publicLink}
            >
              <span>View live site</span>
              <ExternalLink size={13} />
            </a>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              type="button"
              className={styles.hamburgerBtn}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <div className={styles.breadcrumbs}>
              <span>CMS</span>
              <ChevronRight size={13} />
              <strong className={styles.activeBreadcrumb}>{currentTitle}</strong>
            </div>
          </div>

          <div className={styles.topbarRight}>
            <div className={styles.statusIndicator}>
              <span className={styles.statusDot} />
              <span className={styles.statusText}>API Connected</span>
            </div>
            <div className={styles.roleBadge}>
              <ShieldCheck size={13} />
              <span>{user?.role?.toUpperCase() || 'ADMIN'}</span>
            </div>
          </div>
        </header>

        <main className={styles.adminMain}>
          <div className={styles.content}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
