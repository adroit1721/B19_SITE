import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, clearAuthError, selectAuth } from '../../features/auth/authSlice';
import { GraduationCap, Eye, EyeOff, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(selectAuth);
  const [form, setForm] = useState({ username: '', password: '' });
  const [show, setShow] = useState(false);

  useEffect(() => { if (isAuthenticated) navigate('/admin/dashboard'); }, [isAuthenticated, navigate]);
  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearAuthError()); }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { toast.error('Please fill in all fields'); return; }
    dispatch(loginAdmin(form));
  };

  return (
    <div id="admin-login-page" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-3xl" />
      </div>
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
        <div className="glass-card p-10">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/20 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-neon-cyan" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-1">Backbencher&apos;s 19 · SSC 2019</p>
          </div>

          <form id="admin-login-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-username" className="block text-sm font-medium text-gray-400 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input id="admin-username" type="text" className="input-neon pl-10" placeholder="Admin"
                  value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input id="admin-password" type={show ? 'text' : 'password'} className="input-neon pl-10 pr-10" placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button id="admin-login-btn" type="submit" disabled={loading} className="btn-neon w-full flex items-center justify-center gap-2 py-3 mt-2 disabled:opacity-50">
              {loading ? <><span className="spinner w-4 h-4" />Signing in...</> : 'Sign In to Dashboard'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-700 mt-6">
            Default: <span className="font-mono text-gray-600">Admin / admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
