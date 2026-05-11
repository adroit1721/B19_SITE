import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { getMe, selectIsAuthenticated } from './features/auth/authSlice';

// Layout
import Header from './components/Header';
import Footer from './components/Footer';

// Public Pages
import Home    from './pages/Home';
import About   from './pages/About';
import Events  from './pages/Events';
import Gallery from './pages/Gallery';
import Blogs   from './pages/Blogs';

// Admin Pages
import AdminLogin    from './pages/admin/Login';
import AdminLayout   from './pages/admin/AdminLayout';
import Dashboard     from './pages/admin/Dashboard';
import AdminEvents   from './pages/admin/AdminEvents';
import AdminGallery  from './pages/admin/AdminGallery';
import AdminBlogs    from './pages/admin/AdminBlogs';
import AdminFooter   from './pages/admin/AdminFooter';
import AdminAbout    from './pages/admin/AdminAbout';
import AdminSettings from './pages/admin/AdminSettings';
import AdminMembers from './pages/admin/AdminMembers';

import MemberDirectory from './pages/MemberDirectory';
import MemberRegistration from './pages/MemberRegistration';
import Maintenance from './pages/Maintenance';
import { fetchSettings } from './features/settings/settingsSlice';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}

// Public Layout wrapper
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const settings = useSelector((s) => s.settings.data);
  const token    = localStorage.getItem('bb19_token');

  // Validate token on mount
  useEffect(() => {
    if (token) dispatch(getMe());
    dispatch(fetchSettings());
  }, [dispatch, token]);

  // Dynamic Branding (Title & Favicon)
  useEffect(() => {
    if (settings) {
      document.title = settings.siteName || "Backbencher's 19";
      const favicon = document.getElementById('favicon');
      if (favicon) favicon.href = settings.faviconUrl || '/images/favicon.ico';
    }
  }, [settings]);

  const isMaintenance = settings && !settings.isSitePublic && !location.pathname.startsWith('/admin');

  if (isMaintenance) {
    return <Maintenance message={settings.maintenanceMessage} siteName={settings.siteName} />;
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1a2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
          success: { iconTheme: { primary: '#00f5ff', secondary: '#020408' } },
          error:   { iconTheme: { primary: '#ff2d78', secondary: '#020408' } },
          duration: 3000,
        }}
      />

      <Routes>
        {/* ── Public Routes ─────────────────────────────────────── */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about"   element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/events"  element={<PublicLayout><Events /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/blogs"   element={<PublicLayout><Blogs /></PublicLayout>} />
        <Route path="/directory" element={<PublicLayout><MemberDirectory /></PublicLayout>} />
        <Route path="/register"  element={<PublicLayout><MemberRegistration /></PublicLayout>} />

        {/* ── Admin Routes ──────────────────────────────────────── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="events"    element={<AdminEvents />} />
          <Route path="gallery"   element={<AdminGallery />} />
          <Route path="blogs"     element={<AdminBlogs />} />
          <Route path="footer"    element={<AdminFooter />} />
          <Route path="about"     element={<AdminAbout />} />
          <Route path="settings"  element={<AdminSettings />} />
          <Route path="members"   element={<AdminMembers />} />
        </Route>

        {/* ── 404 Fallback ──────────────────────────────────────── */}
        <Route path="*" element={
          <PublicLayout>
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
              <p className="font-display font-black text-8xl neon-text mb-4">404</p>
              <h1 className="font-display font-bold text-2xl text-white mb-3">Page Not Found</h1>
              <p className="text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
              <a href="/" className="btn-neon">Go Home</a>
            </div>
          </PublicLayout>
        } />
      </Routes>
    </>
  );
}
