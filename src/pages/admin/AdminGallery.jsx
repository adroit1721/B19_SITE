import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGalleryAdmin, uploadGalleryItem, deleteGalleryItem, clearGalleryError, clearGalleryMsg } from '../../features/gallery/gallerySlice';
import { selectGallery } from '../../features/gallery/gallerySlice';
import { Upload, Trash2, Image, Video, X, Plus, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { title: '', type: 'photo', description: '', tags: '', url: '', order: 0 };

export default function AdminGallery() {
  const dispatch = useDispatch();
  const items    = useSelector(selectGallery);
  const { loading, successMsg, error } = useSelector((s) => s.gallery);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [file,     setFile]     = useState(null);
  const [useUrl,   setUseUrl]   = useState(false);

  useEffect(() => { dispatch(fetchGalleryAdmin()); }, [dispatch]);
  useEffect(() => {
    if (successMsg) { toast.success(successMsg); dispatch(clearGalleryMsg()); setShowForm(false); setForm(EMPTY); setFile(null); }
    if (error)      { toast.error(error);        dispatch(clearGalleryError()); }
  }, [successMsg, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file && !useUrl) fd.append('file', file);
    dispatch(uploadGalleryItem(fd));
  };

  const handleDelete = (id) => { if (window.confirm('Delete this item?')) dispatch(deleteGalleryItem(id)); };

  const photos = items.filter((i) => i.type === 'photo');
  const videos = items.filter((i) => i.type === 'video');

  return (
    <div id="admin-gallery" className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-1">Gallery Management</h1>
          <p className="text-gray-500 text-sm">{photos.length} photos · {videos.length} videos</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-neon flex items-center gap-2"><Plus className="w-4 h-4" />Upload Media</button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="glass-card p-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl text-white">Upload Media</h2>
            <button onClick={() => setShowForm(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                <input className="input-neon" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                <div className="flex gap-3">
                  {['photo', 'video'].map((t) => (
                    <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${form.type === t ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' : 'border-white/10 text-gray-500 hover:border-white/20'}`}>
                      {t === 'photo' ? <><Image className="w-4 h-4 inline mr-2" />Photo</> : <><Video className="w-4 h-4 inline mr-2" />Video</>}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <input className="input-neon" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma separated)</label>
                <input className="input-neon" placeholder="reunion, 2024, fun" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>

              {/* File Upload or URL */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-3">
                  <label className="block text-sm font-medium text-gray-400">Media Source</label>
                  <button type="button" onClick={() => setUseUrl(!useUrl)} className="text-xs text-neon-cyan hover:underline flex items-center gap-1">
                    {useUrl ? <><Upload className="w-3 h-3" />Switch to File Upload</> : <><LinkIcon className="w-3 h-3" />Use External URL</>}
                  </button>
                </div>
                {useUrl ? (
                  <input className="input-neon" placeholder="https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
                ) : (
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-neon-cyan/30 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('gallery-file-input').click()}>
                    <Upload className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">{file ? file.name : 'Click to upload file'}</p>
                    <p className="text-gray-700 text-xs mt-1">Max 50MB · Images & Videos</p>
                    <input id="gallery-file-input" type="file" accept="image/*,video/*" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-neon flex items-center gap-2 disabled:opacity-50">
                {loading ? <><span className="spinner w-4 h-4" />Uploading...</> : <><Upload className="w-4 h-4" />Upload</>}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Grid */}
      {loading && !items.length ? <div className="flex justify-center py-20"><div className="spinner w-10 h-10" /></div> : (
        <div>
          {items.length === 0 ? (
            <div className="text-center py-20"><Image className="w-16 h-16 text-gray-700 mx-auto mb-4" /><p className="text-gray-600">No media yet.</p></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item._id} className="group relative rounded-2xl overflow-hidden bg-dark-800 aspect-square">
                  {item.type === 'photo' ? (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-dark-700">
                      <Video className="w-10 h-10 text-neon-cyan" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-dark-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                    <p className="text-white text-xs font-medium text-center line-clamp-2">{item.title}</p>
                    <button onClick={() => handleDelete(item._id)} className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-dark-950/70 text-gray-400">{item.type === 'photo' ? '📸' : '🎥'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
