import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMembersAdmin, createMember, updateMember, deleteMember,
  clearMemberMsg, clearMemberError, selectAdminMembers
} from '../../features/members/memberSlice';
import { Plus, Trash2, Edit, Search, X, Save, User, Mail, Phone, Briefcase, MapPin, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const EMPTY = {
  name: '', studentId: '', batch: '2019', group: 'Science',
  phone: '', email: '', presentAddress: '', permanentAddress: '',
  occupation: '', organization: '', photoUrl: '',
  socialLinks: { facebook: '', linkedin: '', instagram: '', whatsapp: '' },
  isPublic: true, order: 0
};

export default function AdminMembers() {
  const dispatch = useDispatch();
  const members  = useSelector(selectAdminMembers);
  const { loading, successMsg, error } = useSelector((s) => s.members);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [search,   setSearch]   = useState('');
  const [uploading, setUploading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { 
    dispatch(fetchMembersAdmin(statusFilter === 'all' ? {} : { status: statusFilter })); 
  }, [dispatch, statusFilter]);

  useEffect(() => {
    if (successMsg) { 
      toast.success(successMsg); 
      dispatch(clearMemberMsg()); 
      setShowForm(false); 
      setEditing(null); 
      setForm(EMPTY); 
      dispatch(fetchMembersAdmin(statusFilter === 'all' ? {} : { status: statusFilter })); 
    }
    if (error)      { toast.error(error);       dispatch(clearMemberError()); }
  }, [successMsg, error, dispatch, statusFilter]);

  const handleEdit = (m) => { setEditing(m._id); setForm(m); setShowForm(true); };
  const handleDelete = (id) => { if (window.confirm('Delete this member?')) dispatch(deleteMember(id)); };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/members/${id}`, { status: newStatus });
      toast.success(`Member ${newStatus}`);
      dispatch(fetchMembersAdmin(statusFilter === 'all' ? {} : { status: statusFilter }));
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await api.post('/upload', fd);
      setForm({ ...form, photoUrl: data.url });
      toast.success('Photo uploaded!');
    } catch (err) { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) dispatch(updateMember({ id: editing, data: form }));
    else         dispatch(createMember(form));
  };

  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.occupation?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div id="admin-members" className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-1">Member Directory</h1>
          <p className="text-gray-500 text-sm">{members.length} members shown</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            {['all', 'pending', 'approved', 'rejected'].map(s => (
              <button 
                key={s} 
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === s ? 'bg-neon-cyan text-dark-950 shadow-neon-cyan' : 'text-gray-500 hover:text-white'}`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input className="input-neon pl-10 py-2 text-sm" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY); }} className="btn-neon flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Member
          </button>
        </div>
      </div>

      {showForm && (
        <div className="glass-card p-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl text-white">{editing ? 'Edit Member' : 'Add New Member'}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Photo */}
              <div className="md:row-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Member Photo</label>
                <div className="relative group w-full aspect-square rounded-2xl bg-white/3 border border-white/5 overflow-hidden flex items-center justify-center">
                  {form.photoUrl ? (
                    <>
                      <img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="btn-neon text-xs cursor-pointer py-2 px-4">Change Photo
                          <input type="file" className="hidden" onChange={handlePhotoUpload} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-neon-cyan transition-colors">
                      <User className="w-12 h-12 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-widest">Upload Photo</span>
                      <input type="file" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  )}
                  {uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><div className="spinner w-8 h-8" /></div>}
                </div>
              </div>

              {/* Basic Info */}
              <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">Full Name *</label><input className="input-neon" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">Student ID / Roll</label><input className="input-neon" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} /></div>
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">Group</label>
                  <select className="input-neon" value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}>
                    {['Science','Commerce','Arts','Other'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">Occupation</label><input className="input-neon" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} /></div>
                <div className="md:col-span-2"><label className="text-xs font-medium text-gray-500 mb-1 block">Organization / Institution</label><input className="input-neon" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} /></div>
              </div>

              {/* Contact Info */}
              <div className="md:col-span-3 grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">Phone</label><input className="input-neon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">Email</label><input type="email" className="input-neon" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="md:col-span-2"><label className="text-xs font-medium text-gray-500 mb-1 block">Facebook URL</label><input className="input-neon" value={form.socialLinks.facebook} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })} /></div>
              </div>

              <div className="md:col-span-3 grid md:grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">Present Address</label><textarea className="input-neon min-h-[80px]" value={form.presentAddress} onChange={(e) => setForm({ ...form, presentAddress: e.target.value })} /></div>
                <div><label className="text-xs font-medium text-gray-500 mb-1 block">Permanent Address</label><textarea className="input-neon min-h-[80px]" value={form.permanentAddress} onChange={(e) => setForm({ ...form, permanentAddress: e.target.value })} /></div>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} className="w-5 h-5 accent-neon-cyan" />
                <span className="text-sm text-gray-400">Publicly Visible</span>
              </label>
              <div className="flex-1" />
              <button type="submit" disabled={loading} className="btn-neon flex items-center gap-2">
                {loading ? <><span className="spinner w-4 h-4" />Saving...</> : <><Save className="w-4 h-4" />{editing ? 'Update Member' : 'Save Member'}</>}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m) => (
          <div key={m._id} className="glass-card p-5 group flex items-start gap-4 hover:border-neon-cyan/30 transition-all">
            <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/5 overflow-hidden flex-shrink-0">
              {m.photoUrl ? <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" /> : <User className="w-full h-full p-4 text-gray-700" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold truncate">{m.name}</h3>
              <p className="text-neon-cyan text-xs font-medium mb-2">{m.occupation || 'Member'}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  m.status === 'approved' ? 'bg-green-500/10 text-green-400' : 
                  m.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                  'bg-red-500/10 text-red-400'
                }`}>
                  {m.status}
                </span>
                {!m.isPublic && <span className="px-2 py-0.5 rounded bg-white/5 text-gray-500 text-[10px] font-bold uppercase">Private</span>}
              </div>
              <div className="space-y-1">
                {m.email && <p className="text-gray-500 text-[10px] flex items-center gap-2"><Mail className="w-3 h-3" />{m.email}</p>}
                {m.phone && <p className="text-gray-500 text-[10px] flex items-center gap-2"><Phone className="w-3 h-3" />{m.phone}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {m.status === 'pending' && (
                <>
                  <button onClick={() => handleStatusUpdate(m._id, 'approved')} className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all" title="Approve"><Save className="w-4 h-4" /></button>
                  <button onClick={() => handleStatusUpdate(m._id, 'rejected')} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all" title="Reject"><X className="w-4 h-4" /></button>
                </>
              )}
              <button onClick={() => handleEdit(m)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(m._id)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white/2 rounded-3xl border border-dashed border-white/5">
          <User className="w-16 h-16 text-gray-800 mx-auto mb-4 opacity-20" />
          <p className="text-gray-500">No members found matching your search.</p>
        </div>
      )}
    </div>
  );
}
