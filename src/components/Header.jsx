import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react';
import { fetchSettings, selectSettings } from '../features/settings/settingsSlice';

const navLinks = [
  { to: '/',       label: 'Home'    },
  { to: '/about',  label: 'About'   },
  { to: '/events', label: 'Events'  },
  { to: '/gallery',label: 'Gallery' },
  { to: '/blogs',  label: 'Blogs'   },
  { to: '/directory', label: 'Directory' },
];

export default function Header() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const location = useLocation();

  useEffect(() => { if (!settings) dispatch(fetchSettings()); }, [dispatch, settings]);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Track scroll for header opacity
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-header ${
        scrolled ? 'shadow-lg shadow-black/30' : ''
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* ── Logo ─────────────────────────────────────────────────── */}
          <Link
            to="/"
            id="header-logo"
            className="flex items-center gap-3 group"
          >
            <div className="relative flex items-center justify-center">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.siteName}
                  className="h-10 w-10 object-contain rounded-xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`h-10 w-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple items-center justify-center ${settings?.logoUrl ? 'hidden' : 'flex'}`}
                aria-hidden="true"
              >
                <GraduationCap className="h-6 w-6 text-dark-950" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-neon-cyan rounded-full animate-pulse" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-white text-lg tracking-tight group-hover:neon-text transition-all duration-300">
                {settings?.siteName || "Backbencher's 19"}
              </span>
              <span className="text-gray-500 text-[10px] font-mono tracking-[0.2em] uppercase">
                SSC BATCH-2019
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ───────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                id={`nav-${label.toLowerCase()}`}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neon-cyan" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

          </nav>

          {/* ── Mobile Menu Toggle ────────────────────────────────────── */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glass-header border-t border-white/8 px-4 py-4 space-y-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
