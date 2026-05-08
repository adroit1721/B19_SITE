import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, selectEvents } from '../../features/events/eventSlice';
import { fetchGallery, selectGallery } from '../../features/gallery/gallerySlice';
import { fetchBlogs, selectBlogs } from '../../features/blogs/blogSlice';
import { changePassword, clearPasswordMsg, clearAuthError, selectAuth } from '../../features/auth/authSlice';
import { useState } from 'react';
import { CalendarDays, Images, BookOpen, Users, TrendingUp, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const dispatch = useDispatch();
  const events   = useSelector(selectEvents);
  const gallery  = useSelector(selectGallery);
  const blogs    = useSelector(selectBlogs);
  const { loading, error, passwordMsg } = useSelector(selectAuth);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [showPw, setShowPw] = useState({});

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchGallery());
    dispatch(fetchBlogs());
  }, [dispatch]);

  useEffect(() => {
    if (passwordMsg) { toast.success(passwordMsg); dispatch(clearPasswordMsg()); setPwForm({ currentPassword: '', newPassword: '', confirm: '' }); }
    if (error) { toast.error(error); dispatch(clearAuthError()); }
  }, [passwordMsg, error, dispatch]);

  const activeEvent  = events.find((e) => e.status === 'active');
  const stats = [
    { label: 'Total Events',  value: events.length,  icon: CalendarDays, color: 'text-neon-cyan',   bg: 'bg-neon-cyan/10',   link: '/admin/events' },
    { label: 'Gallery Items', value: gallery.length, icon: Images,       color: 'text-neon-pink',   bg: 'bg-neon-pink/10',   link: '/admin/gallery' },
    { label: 'Blog Posts',    value: blogs.length,   icon: BookOpen,     color: 'text-neon-purple', bg: 'bg-neon-purple/10', link: '/admin/blogs' },
    { label: 'Active Events', value: events.filter((e) => e.status === 'active').length, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10', link: '/admin/events' },
  ];

  const handlePwSubmit = (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    dispatch(changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }));
  };

  return (
    <div id="admin-dashboard" className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-3xl text-white mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of Backbencher&apos;s 19 platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, link }) => (
          <Link key={label} to={link} className="glass-card p-6 hover:border-neon-cyan/20 transition-all group hover:-translate-y-1">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className={`font-display font-bold text-3xl ${color} mb-1`}>{value}</div>
            <div className="text-gray-500 text-sm">{label}</div>
          </Link>
        ))}
      </div>

      {/* Active Event Status */}
      {activeEvent && (
        <div className="glass-card p-6 border-green-500/20">
          <div className="flex items-center gap-3 mb-3">
            <span className="badge-active"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Active Event</span>
          </div>
          <h2 className="font-display font-bold text-xl text-white mb-1">{activeEvent.title}</h2>
          <p className="text-gray-500 text-sm mb-4">{activeEvent.venue} · {new Date(activeEvent.date).toLocaleDateString()}</p>
          <div className="flex gap-3">
            <Link to={`/admin/events`} className="btn-outline-neon text-sm py-2 px-4">Manage Event</Link>
            <a href={`/api/events/${activeEvent._id}/registrations/csv`} className="btn-ghost text-sm flex items-center gap-2">
              📥 Download CSV
            </a>
          </div>
        </div>
      )}

      {/* Recent Events */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-lg text-white">Recent Events</h2>
          <Link to="/admin/events" className="text-neon-cyan text-sm hover:underline">View all →</Link>
        </div>
        {events.length > 0 ? (
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div key={event._id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-white font-medium text-sm">{event.title}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{event.venue}</p>
                </div>
                <span className={`badge-${event.status} text-xs`}>{event.status}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-600 text-sm">No events yet.</p>}
      </div>

      {/* Change Password */}
      <div className="glass-card p-6">
        <h2 className="font-display font-semibold text-lg text-white mb-5 flex items-center gap-2">
          <Lock className="w-5 h-5 text-neon-purple" /> Change Password
        </h2>
        <form id="change-password-form" onSubmit={handlePwSubmit} className="grid md:grid-cols-3 gap-4">
          {[
            { key: 'currentPassword', label: 'Current Password' },
            { key: 'newPassword',     label: 'New Password' },
            { key: 'confirm',         label: 'Confirm New Password' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
              <div className="relative">
                <input type={showPw[key] ? 'text' : 'password'} className="input-neon pr-10"
                  value={pwForm[key]} onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })} required />
                <button type="button" onClick={() => setShowPw({ ...showPw, [key]: !showPw[key] })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <div className="md:col-span-3">
            <button id="change-password-btn" type="submit" disabled={loading} className="btn-neon flex items-center gap-2 disabled:opacity-50">
              {loading ? <><span className="spinner w-4 h-4" />Updating...</> : <><CheckCircle className="w-4 h-4" />Update Password</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
