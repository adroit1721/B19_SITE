import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAdmin } from '../../features/auth/authSlice';
import { fetchSettings, selectSettings } from '../../features/settings/settingsSlice';
import {
  LayoutDashboard, CalendarDays, Images, BookOpen, Settings,
  Info, LogOut, Menu, X, GraduationCap, ChevronRight, Palette
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard',        label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/admin/settings',         label: 'Site Branding',  icon: Palette },
  { to: '/admin/events',           label: 'Events',         icon: CalendarDays },
  { to: '/admin/gallery',          label: 'Gallery',        icon: Images },
  { to: '/admin/blogs',            label: 'Blogs',          icon: BookOpen },
  { to: '/admin/about',            label: 'About Us Editor',icon: Info },
  { to: '/admin/footer',           label: 'Footer Config',  icon: Settings },
];

export default function AdminLayout() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const admin     = useSelector(selectAdmin);
  const settings  = useSelector(selectSettings);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { if (!settings) dispatch(fetchSettings()); }, [dispatch, settings]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/20 flex items-center justify-center flex-shrink-0">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
            ) : (
              <GraduationCap className="w-5 h-5 text-neon-cyan" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-white text-sm truncate">{settings?.siteName || "Backbencher's 19"}</p>
            <p className="text-gray-600 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }>
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/8 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-dark-950 font-bold text-sm flex-shrink-0">
            {admin?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{admin?.username}</p>
            <p className="text-gray-600 text-xs capitalize">{admin?.role}</p>
          </div>
        </div>
        <button id="admin-logout-btn" onClick={handleLogout}
          className="sidebar-link w-full text-red-500 hover:text-red-400 hover:bg-red-500/5">
          <LogOut className="w-4 h-4" />Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col admin-sidebar fixed top-0 left-0 h-screen z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`md:hidden fixed top-0 left-0 h-screen w-72 z-50 admin-sidebar transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="glass-header sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
          <button id="admin-menu-toggle" onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block">
            <p className="text-gray-500 text-sm">Welcome back, <span className="text-white font-medium">{admin?.username}</span> 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge-active text-xs"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Live</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
