import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFooter, updateFooter, clearFooterMsg, selectFooter } from '../../features/footer/footerSlice';
import { Save, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminFooter() {
  const dispatch = useDispatch();
  const footer   = useSelector(selectFooter);
  const { loading, successMsg, error } = useSelector((s) => s.footer);
  const [form, setForm] = useState(null);

  useEffect(() => { dispatch(fetchFooter()); }, [dispatch]);
  useEffect(() => { if (footer) setForm(footer); }, [footer]);
  useEffect(() => {
    if (successMsg) { toast.success(successMsg); dispatch(clearFooterMsg()); }
    if (error)      { toast.error(error); }
  }, [successMsg, error, dispatch]);

  if (!form) return <div className="flex justify-center py-20"><div className="spinner w-10 h-10" /></div>;

  const setField  = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setSocial = (k, v) => setForm((f) => ({ ...f, socialLinks: { ...f.socialLinks, [k]: v } }));

  const addLink    = () => setForm((f) => ({ ...f, quickLinks: [...(f.quickLinks || []), { label: '', url: '' }] }));
  const removeLink = (i) => setForm((f) => ({ ...f, quickLinks: f.quickLinks.filter((_, idx) => idx !== i) }));
  const updateLink = (i, k, v) => setForm((f) => ({ ...f, quickLinks: f.quickLinks.map((l, idx) => idx === i ? { ...l, [k]: v } : l) }));

  const handleSubmit = (e) => { e.preventDefault(); dispatch(updateFooter(form)); };

  return (
    <div id="admin-footer" className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-3xl text-white mb-1">Footer Configuration</h1>
        <p className="text-gray-500 text-sm">Manage footer content displayed to all visitors</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display font-semibold text-lg text-white border-b border-white/8 pb-4">Branding</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[['groupName','Group Name'],['batchName','Batch Name'],['schoolName','School Name'],['tagline','Tagline']].map(([k, l]) => (
              <div key={k}>
                <label className="block text-sm font-medium text-gray-400 mb-2">{l}</label>
                <input className="input-neon" value={form[k] || ''} onChange={(e) => setField(k, e.target.value)} />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <textarea className="input-neon min-h-[80px]" value={form.description || ''} onChange={(e) => setField('description', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display font-semibold text-lg text-white border-b border-white/8 pb-4">Contact</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[['email','Email'],['phone','Phone']].map(([k, l]) => (
              <div key={k}>
                <label className="block text-sm font-medium text-gray-400 mb-2">{l}</label>
                <input className="input-neon" type={k} value={form[k] || ''} onChange={(e) => setField(k, e.target.value)} />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
              <input className="input-neon" value={form.address || ''} onChange={(e) => setField('address', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display font-semibold text-lg text-white border-b border-white/8 pb-4">Social Media</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {['facebook','instagram','youtube','twitter'].map((k) => (
              <div key={k}>
                <label className="block text-sm font-medium text-gray-400 mb-2 capitalize">{k}</label>
                <input className="input-neon" placeholder={`https://${k}.com/...`} value={form.socialLinks?.[k] || ''} onChange={(e) => setSocial(k, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/8 pb-4">
            <h2 className="font-display font-semibold text-lg text-white">Quick Links</h2>
            <button type="button" onClick={addLink} className="btn-outline-neon text-sm flex items-center gap-2 py-2 px-4"><Plus className="w-4 h-4" />Add Link</button>
          </div>
          <div className="space-y-3">
            {(form.quickLinks || []).map((link, i) => (
              <div key={i} className="flex items-center gap-3">
                <input className="input-neon flex-1" placeholder="Label" value={link.label} onChange={(e) => updateLink(i, 'label', e.target.value)} />
                <input className="input-neon flex-1" placeholder="/path or URL" value={link.url} onChange={(e) => updateLink(i, 'url', e.target.value)} />
                <button type="button" onClick={() => removeLink(i)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="glass-card p-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Copyright Text</label>
          <input className="input-neon" value={form.copyrightText || ''} onChange={(e) => setField('copyrightText', e.target.value)} />
        </div>

        <button type="submit" disabled={loading} className="btn-neon flex items-center gap-2 disabled:opacity-50">
          {loading ? <><span className="spinner w-4 h-4" />Saving...</> : <><Save className="w-4 h-4" />Save Footer Config</>}
        </button>
      </form>
    </div>
  );
}
