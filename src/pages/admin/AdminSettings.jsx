import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, updateSettings, clearSettingsMsg, selectSettings } from '../../features/settings/settingsSlice';
import api from '../../services/api';
import { Save, Upload, Globe, Image as ImageIcon, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const { loading, successMsg } = useSelector((s) => s.settings);
  const [form, setForm] = useState({ siteName: '', logoUrl: '', faviconUrl: '' });
  const [uploading, setUploading] = useState({ logo: false, favicon: false });

  useEffect(() => { dispatch(fetchSettings()); }, [dispatch]);
  useEffect(() => { if (settings) setForm(settings); }, [settings]);
  useEffect(() => {
    if (successMsg) { toast.success(successMsg); dispatch(clearSettingsMsg()); }
  }, [successMsg, dispatch]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    const localUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, [type === 'logo' ? 'logoUrl' : 'faviconUrl']: localUrl }));

    setUploading({ ...uploading, [type]: true });
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update with server path (prepend host for reliability if needed, 
      // but proxy should handle /uploads. Using relative path is better for production)
      setForm((prev) => ({ ...prev, [type === 'logo' ? 'logoUrl' : 'faviconUrl']: data.url }));
      toast.success(`${type} uploaded! Remember to save.`);
    } catch (err) {
      toast.error(`Failed to upload ${type}`);
      // Revert to original if failed?
      dispatch(fetchSettings()); 
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSettings(form));
  };

  return (
    <div id="admin-settings" className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-3xl text-white mb-1">Site Settings</h1>
        <p className="text-gray-500 text-sm">Manage site-wide branding and configuration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-8 space-y-8">
          {/* Site Name */}
          <div className="space-y-4">
            <h2 className="text-white font-semibold flex items-center gap-2"><Globe className="w-5 h-5 text-neon-cyan" /> General</h2>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Site Name</label>
              <input className="input-neon" value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Logo */}
            <div className="space-y-4">
              <h2 className="text-white font-semibold flex items-center gap-2"><ImageIcon className="w-5 h-5 text-neon-purple" /> Site Logo</h2>
              <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white/3 border border-white/5">
                {form.logoUrl ? (
                  <div className="relative group w-32 h-32 mx-auto">
                    <img src={form.logoUrl} alt="Logo Preview" className="w-full h-full object-contain rounded-xl" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <label className="cursor-pointer text-white text-xs font-bold">Change
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'logo')} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="w-32 h-32 mx-auto border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-neon-cyan/50 transition-colors">
                    <Upload className="w-6 h-6 text-gray-600 mb-2" />
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Upload Logo</span>
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'logo')} />
                  </label>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">URL</label>
                  <input className="input-neon text-xs py-2" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="/images/logo.png" />
                </div>
              </div>
            </div>

            {/* Favicon */}
            <div className="space-y-4">
              <h2 className="text-white font-semibold flex items-center gap-2"><CheckCircle className="w-5 h-5 text-neon-pink" /> Favicon</h2>
              <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white/3 border border-white/5">
                {form.faviconUrl ? (
                  <div className="relative group w-16 h-16 mx-auto">
                    <img src={form.faviconUrl} alt="Favicon Preview" className="w-full h-full object-contain rounded-xl" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <label className="cursor-pointer text-white text-xs font-bold">Change
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'favicon')} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="w-16 h-16 mx-auto border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-neon-cyan/50 transition-colors">
                    <Upload className="w-4 h-4 text-gray-600 mb-1" />
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Favicon</span>
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'favicon')} />
                  </label>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">URL</label>
                  <input className="input-neon text-xs py-2" value={form.faviconUrl} onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })} placeholder="/favicon.ico" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-neon flex items-center gap-2 disabled:opacity-50">
          {loading ? <><span className="spinner w-4 h-4" />Saving...</> : <><Save className="w-4 h-4" />Save Site Branding</>}
        </button>
      </form>
    </div>
  );
}
