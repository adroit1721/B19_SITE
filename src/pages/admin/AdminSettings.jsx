import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, updateSettings, clearSettingsMsg, selectSettings } from '../../features/settings/settingsSlice';
import { fetchGalleryAdmin, selectGallery } from '../../features/gallery/gallerySlice';
import api from '../../services/api';
import { Save, Upload, Globe, Image as ImageIcon, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const galleryItems = useSelector(selectGallery);
  const { loading, successMsg } = useSelector((s) => s.settings);
  const [form, setForm] = useState({ 
    siteName: '', logoUrl: '', faviconUrl: '', 
    isSitePublic: true, maintenanceMessage: '' 
  });
  const [uploading, setUploading] = useState({ logo: false, favicon: false });
  const [galleryModal, setGalleryModal] = useState({ open: false, target: null });

  useEffect(() => { 
    dispatch(fetchSettings()); 
    dispatch(fetchGalleryAdmin());
  }, [dispatch]);
  useEffect(() => { if (settings) setForm(settings); }, [settings]);
  useEffect(() => {
    if (successMsg) { toast.success(successMsg); dispatch(clearSettingsMsg()); }
  }, [successMsg, dispatch]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setForm(prev => ({ 
      ...prev, 
      [type === 'logo' ? 'logoUrl' : 'faviconUrl']: localUrl 
    }));

    setUploading(prev => ({ ...prev, [type]: true }));
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setForm(prev => ({ 
        ...prev, 
        [type === 'logo' ? 'logoUrl' : 'faviconUrl']: data.url 
      }));
      toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} uploaded! Click 'Update' to save.`);
    } catch (err) {
      toast.error(`Failed to upload ${type}`);
      // Revert to current saved settings on failure
      dispatch(fetchSettings());
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (uploading.logo || uploading.favicon) {
      return toast.error('Please wait for uploads to finish');
    }
    
    // Safety check: Don't save if it's still a blob URL
    if (form.logoUrl?.startsWith('blob:') || form.faviconUrl?.startsWith('blob:')) {
      return toast.error('Upload still in progress. Please wait.');
    }

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
              <input className="input-neon" value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} placeholder="e.g. Backbencher's 19" />
            </div>
            
            <div className="pt-4 flex flex-col md:flex-row md:items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={!form.isSitePublic} onChange={(e) => setForm({ ...form, isSitePublic: !e.target.checked })} />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${!form.isSitePublic ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-white/10'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${!form.isSitePublic ? 'translate-x-6' : ''}`}></div>
                </div>
                <div>
                  <span className="text-sm font-bold text-white group-hover:text-neon-cyan transition-colors">Maintenance Mode</span>
                  <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Site is currently {form.isSitePublic ? 'Public' : 'Hidden'}</p>
                </div>
              </label>

              {!form.isSitePublic && (
                <div className="flex-1 animate-slide-right">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Maintenance Message</label>
                  <input className="input-neon py-2 text-sm" value={form.maintenanceMessage} onChange={(e) => setForm({ ...form, maintenanceMessage: e.target.value })} placeholder="We'll be back soon..." />
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Logo */}
            <div className="space-y-4">
              <h2 className="text-white font-semibold flex items-center gap-2"><ImageIcon className="w-5 h-5 text-neon-purple" /> Site Logo</h2>
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white/3 border border-white/5 group hover:border-neon-purple/30 transition-all">
                <div className="relative w-32 h-32 mx-auto rounded-xl bg-black/20 border border-white/5 flex items-center justify-center overflow-hidden">
                  {form.logoUrl ? (
                    <img src={form.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-700" />
                  )}
                  {uploading.logo && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><div className="spinner-purple w-8 h-8" /></div>}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <label className="cursor-pointer btn-neon text-[10px] py-1.5 px-3">Upload New
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                    </label>
                    <button type="button" onClick={() => setGalleryModal({ open: true, target: 'logoUrl' })} className="btn-ghost text-[10px] py-1 px-3 border border-white/20 hover:border-white/50">
                      From Gallery
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Image URL</label>
                  <input className="input-neon text-xs py-2" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="Paste URL or upload image" />
                </div>
              </div>
            </div>

            {/* Favicon */}
            <div className="space-y-4">
              <h2 className="text-white font-semibold flex items-center gap-2"><CheckCircle className="w-5 h-5 text-neon-pink" /> Favicon</h2>
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white/3 border border-white/5 group hover:border-neon-pink/30 transition-all">
                <div className="relative w-16 h-16 mx-auto rounded-xl bg-black/20 border border-white/5 flex items-center justify-center overflow-hidden">
                  {form.faviconUrl ? (
                    <img src={form.faviconUrl} alt="Favicon Preview" className="w-full h-full object-contain" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-gray-700" />
                  )}
                  {uploading.favicon && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><div className="spinner-pink w-6 h-6" /></div>}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <label className="cursor-pointer btn-neon text-[10px] py-1.5 px-3">Upload
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'favicon')} />
                    </label>
                    <button type="button" onClick={() => setGalleryModal({ open: true, target: 'faviconUrl' })} className="btn-ghost text-[10px] py-1 px-3 border border-white/20 hover:border-white/50">
                      From Gallery
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Icon URL</label>
                  <input className="input-neon text-xs py-2" value={form.faviconUrl} onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })} placeholder="Paste icon URL or upload" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading || uploading.logo || uploading.favicon} className="btn-neon flex items-center gap-2 py-4 px-10 shadow-neon-cyan hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100">
          {loading ? <><span className="spinner w-4 h-4" />Saving Site...</> : <><Save className="w-5 h-5" />Update Site Branding</>}
        </button>
      </form>
      {galleryModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Select from Gallery</h3>
              <button type="button" onClick={() => setGalleryModal({ open: false, target: null })} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-4">
              {galleryItems?.filter(i => i.type === 'photo').length === 0 && (
                <p className="col-span-full text-center text-gray-500 py-10">No photos found in gallery.</p>
              )}
              {galleryItems?.filter(i => i.type === 'photo').map(item => (
                <div 
                  key={item._id} 
                  onClick={() => {
                    setForm(prev => ({ ...prev, [galleryModal.target]: item.url }));
                    setGalleryModal({ open: false, target: null });
                  }}
                  className="cursor-pointer group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-neon-cyan transition-colors bg-black/20"
                >
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-neon-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
