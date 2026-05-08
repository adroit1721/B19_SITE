import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAbout, updateAbout, clearAboutMsg, selectAbout } from '../../features/about/aboutSlice';
import { Save, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminAbout() {
  const dispatch = useDispatch();
  const about    = useSelector(selectAbout);
  const { loading, successMsg, error } = useSelector((s) => s.about);
  const [form, setForm] = useState(null);

  useEffect(() => { dispatch(fetchAbout()); }, [dispatch]);
  useEffect(() => { if (about) setForm(about); }, [about]);
  useEffect(() => {
    if (successMsg) { toast.success(successMsg); dispatch(clearAboutMsg()); }
    if (error)      { toast.error(error); }
  }, [successMsg, error, dispatch]);

  if (!form) return <div className="flex justify-center py-20"><div className="spinner w-10 h-10" /></div>;

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addStat    = () => setForm((f) => ({ ...f, stats: [...(f.stats || []), { label: '', value: '', icon: '🎓' }] }));
  const removeStat = (i) => setForm((f) => ({ ...f, stats: f.stats.filter((_, idx) => idx !== i) }));
  const updateStat = (i, k, v) => setForm((f) => ({ ...f, stats: f.stats.map((s, idx) => idx === i ? { ...s, [k]: v } : s) }));

  const addMember    = () => setForm((f) => ({ ...f, teamMembers: [...(f.teamMembers || []), { name: '', role: '', photo: '', bio: '', social: {} }] }));
  const removeMember = (i) => setForm((f) => ({ ...f, teamMembers: f.teamMembers.filter((_, idx) => idx !== i) }));
  const updateMember = (i, k, v) => setForm((f) => ({ ...f, teamMembers: f.teamMembers.map((m, idx) => idx === i ? { ...m, [k]: v } : m) }));

  const handleSubmit = (e) => { e.preventDefault(); dispatch(updateAbout(form)); };

  return (
    <div id="admin-about" className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-3xl text-white mb-1">About Us Editor</h1>
        <p className="text-gray-500 text-sm">Edit the public About page content</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display font-semibold text-lg text-white border-b border-white/8 pb-4">Hero Section</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Hero Title</label>
              <input className="input-neon" value={form.heroTitle || ''} onChange={(e) => setField('heroTitle', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Hero Subtitle</label>
              <input className="input-neon" value={form.heroSubtitle || ''} onChange={(e) => setField('heroSubtitle', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display font-semibold text-lg text-white border-b border-white/8 pb-4">Story & Purpose</h2>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Our Story</label>
            <textarea className="input-neon min-h-[120px]" value={form.story || ''} onChange={(e) => setField('story', e.target.value)} />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Mission</label>
              <textarea className="input-neon min-h-[80px]" value={form.mission || ''} onChange={(e) => setField('mission', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Vision</label>
              <textarea className="input-neon min-h-[80px]" value={form.vision || ''} onChange={(e) => setField('vision', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/8 pb-4">
            <h2 className="font-display font-semibold text-lg text-white">Statistics</h2>
            <button type="button" onClick={addStat} className="btn-outline-neon text-sm flex items-center gap-2 py-2 px-4"><Plus className="w-4 h-4" />Add Stat</button>
          </div>
          <div className="space-y-3">
            {(form.stats || []).map((stat, i) => (
              <div key={i} className="grid grid-cols-4 gap-3 items-center">
                <input className="input-neon" placeholder="Icon (emoji)" value={stat.icon} onChange={(e) => updateStat(i, 'icon', e.target.value)} />
                <input className="input-neon" placeholder="Value" value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} />
                <input className="input-neon" placeholder="Label" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} />
                <button type="button" onClick={() => removeStat(i)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/8 pb-4">
            <h2 className="font-display font-semibold text-lg text-white">Team Members</h2>
            <button type="button" onClick={addMember} className="btn-outline-neon text-sm flex items-center gap-2 py-2 px-4"><Plus className="w-4 h-4" />Add Member</button>
          </div>
          <div className="space-y-4">
            {(form.teamMembers || []).map((m, i) => (
              <div key={i} className="p-4 bg-white/3 rounded-xl space-y-3">
                <div className="grid md:grid-cols-4 gap-3">
                  <input className="input-neon" placeholder="Name" value={m.name} onChange={(e) => updateMember(i, 'name', e.target.value)} />
                  <input className="input-neon" placeholder="Role" value={m.role} onChange={(e) => updateMember(i, 'role', e.target.value)} />
                  <input className="input-neon" placeholder="Photo URL" value={m.photo} onChange={(e) => updateMember(i, 'photo', e.target.value)} />
                  <button type="button" onClick={() => removeMember(i)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
                <input className="input-neon text-sm" placeholder="Short bio" value={m.bio} onChange={(e) => updateMember(i, 'bio', e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-neon flex items-center gap-2 disabled:opacity-50">
          {loading ? <><span className="spinner w-4 h-4" />Saving...</> : <><Save className="w-4 h-4" />Save About Page</>}
        </button>
      </form>
    </div>
  );
}
