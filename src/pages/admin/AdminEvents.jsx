import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEvents, createEvent, updateEvent, deleteEvent,
  fetchRegistrations, selectEvents, clearSuccessMsg, clearEventError
} from '../../features/events/eventSlice';
import api from '../../services/api';
import { Plus, Trash2, Edit, Download, Users, X, Save, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_EVENT = {
  status: 'upcoming', maxParticipants: 0, showPublicData: false,
  registrationDeadline: '', formSchema: [],
};

const EMPTY_FIELD = { name: '', label: '', type: 'text', placeholder: '', required: false, order: 0, options: [] };

const FIELD_TYPES = ['text','email','phone','number','select','textarea','checkbox','date'];

export default function AdminEvents() {
  const dispatch = useDispatch();
  const events   = useSelector(selectEvents);
  const { loading, successMsg, error, registrations } = useSelector((s) => s.events);
  const [showForm,      setShowForm]      = useState(false);
  const [editing,       setEditing]       = useState(null);
  const [form,          setForm]          = useState(EMPTY_EVENT);
  const [viewRegId,     setViewRegId]     = useState(null);
  const [expandSchema,  setExpandSchema]  = useState(false);

  useEffect(() => { dispatch(fetchEvents()); }, [dispatch]);
  useEffect(() => {
    if (successMsg) { toast.success(successMsg); dispatch(clearSuccessMsg()); setShowForm(false); setEditing(null); setForm(EMPTY_EVENT); }
    if (error)      { toast.error(error);       dispatch(clearEventError()); }
  }, [successMsg, error, dispatch]);

  const handleEdit = (event) => {
    setEditing(event._id);
    setForm({ ...event, date: event.date?.slice(0, 10), registrationDeadline: event.registrationDeadline?.slice(0, 10) || '' });
    setShowForm(true); setExpandSchema(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this event and all its registrations?')) dispatch(deleteEvent(id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) dispatch(updateEvent({ id: editing, data: form }));
    else         dispatch(createEvent(form));
  };

  const handleViewReg = (id) => {
    setViewRegId(id);
    dispatch(fetchRegistrations(id));
  };

  const handleDownloadCSV = async (id, title) => {
    try {
      const response = await api.get(`/events/${id}/registrations/csv`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/\s+/g, '_')}_registrations.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to download CSV');
    }
  };

  // Form schema builder helpers
  const addField = () => setForm((f) => ({ ...f, formSchema: [...f.formSchema, { ...EMPTY_FIELD, order: f.formSchema.length }] }));
  const removeField = (i) => setForm((f) => ({ ...f, formSchema: f.formSchema.filter((_, idx) => idx !== i) }));
  const updateField = (i, key, val) => setForm((f) => ({ ...f, formSchema: f.formSchema.map((fld, idx) => idx === i ? { ...fld, [key]: val } : fld) }));

  const viewRegs = viewRegId ? (registrations[viewRegId] || []) : [];

  return (
    <div id="admin-events" className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-1">Event Management</h1>
          <p className="text-gray-500 text-sm">{events.length} total events</p>
        </div>
        <button id="add-event-btn" onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY_EVENT); }}
          className="btn-neon flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl text-white">{editing ? 'Edit Event' : 'Create New Event'}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Event Title *</label>
                <input className="input-neon" placeholder="e.g. Annual Reunion 2025" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Description *</label>
                <textarea className="input-neon min-h-[100px]" placeholder="Event description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Date *</label>
                <input type="date" className="input-neon" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Registration Deadline</label>
                <input type="date" className="input-neon" value={form.registrationDeadline} onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Venue *</label>
                <input className="input-neon" placeholder="Location..." value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Max Participants (0 = unlimited)</label>
                <input type="number" className="input-neon" value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: Number(e.target.value) })} min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <select className="input-neon" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {['upcoming','active','completed','cancelled'].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 pt-8">
                <input 
                  type="checkbox" 
                  id="showPublicData"
                  checked={form.showPublicData} 
                  onChange={(e) => setForm({ ...form, showPublicData: e.target.checked })} 
                  className="w-5 h-5 rounded border-white/10 bg-white/5 text-neon-cyan focus:ring-neon-cyan accent-neon-cyan"
                />
                <label htmlFor="showPublicData" className="text-sm font-medium text-gray-400 cursor-pointer">
                  Public View Enabled (Participants see full data)
                </label>
              </div>
            </div>

            {/* Form Schema Builder */}
            <div className="border border-white/8 rounded-2xl overflow-hidden">
              <button type="button" onClick={() => setExpandSchema(!expandSchema)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/3 transition-colors">
                <span className="font-medium text-white text-sm">Registration Form Builder ({form.formSchema.length} fields)</span>
                {expandSchema ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
              {expandSchema && (
                <div className="p-4 border-t border-white/8 space-y-4">
                  {form.formSchema.map((field, i) => (
                    <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-white/3 rounded-xl">
                      <input className="input-neon text-sm" placeholder="Field name (no spaces)" value={field.name} onChange={(e) => updateField(i, 'name', e.target.value.replace(/\s/g, '_'))} />
                      <input className="input-neon text-sm" placeholder="Label" value={field.label} onChange={(e) => updateField(i, 'label', e.target.value)} />
                      <select className="input-neon text-sm" value={field.type} onChange={(e) => updateField(i, 'type', e.target.value)}>
                        {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <input className="input-neon text-sm flex-1" placeholder="Placeholder" value={field.placeholder} onChange={(e) => updateField(i, 'placeholder', e.target.value)} />
                        <button type="button" onClick={() => removeField(i)} className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      {field.type === 'select' && (
                        <div className="col-span-2 md:col-span-4">
                          <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Options (One per line)</label>
                          <textarea 
                            className="input-neon text-sm min-h-[80px]" 
                            placeholder="Option 1&#10;Option 2&#10;Option 3" 
                            value={field.options?.join('\n') || ''} 
                            onChange={(e) => updateField(i, 'options', e.target.value.split('\n'))} 
                          />
                        </div>
                      )}
                      <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                        <input type="checkbox" checked={field.required} onChange={(e) => updateField(i, 'required', e.target.checked)} className="accent-neon-cyan" />
                        Required
                      </label>
                    </div>
                  ))}
                  <button type="button" onClick={addField} className="btn-outline-neon text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Field
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-neon flex items-center gap-2 disabled:opacity-50">
                {loading ? <><span className="spinner w-4 h-4" />Saving...</> : <><Save className="w-4 h-4" />{editing ? 'Update Event' : 'Create Event'}</>}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/8">
              {['Title','Date','Venue','Status','Actions'].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {loading && !events.length ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center"><div className="spinner w-8 h-8 mx-auto" /></td></tr>
              ) : events.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-600">No events yet.</td></tr>
              ) : events.map((event) => (
                <tr key={event._id} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{event.title}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(event.date).toLocaleDateString('en-BD')}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-[160px] truncate">{event.venue}</td>
                  <td className="px-6 py-4"><span className={`badge-${event.status}`}>{event.status}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(event)} className="p-2 rounded-lg bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 transition-colors" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleViewReg(event._id)} className="p-2 rounded-lg bg-neon-purple/10 text-neon-purple hover:bg-neon-purple/20 transition-colors" title="Registrations"><Users className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDownloadCSV(event._id, event.title)} className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors" title="Download CSV"><Download className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(event._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registrations Modal */}
      {viewRegId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <h2 className="font-display font-semibold text-lg text-white">Registrations ({viewRegs.length})</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => handleDownloadCSV(viewRegId, 'registrations')} className="btn-outline-neon text-sm flex items-center gap-2 py-2 px-4"><Download className="w-4 h-4" />CSV</button>
                <button onClick={() => setViewRegId(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="overflow-y-auto p-6 space-y-3">
              {viewRegs.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-20" />
                  <p className="text-gray-600 text-sm italic">No registrations found for this event.</p>
                </div>
              ) : (
                viewRegs.map((reg, i) => (
                  <div key={reg._id} className="p-5 bg-white/3 border border-white/5 rounded-xl hover:border-white/10 transition-all group">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600 text-xs w-6 text-center">{i + 1}</span>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center text-neon-cyan font-bold text-sm flex-shrink-0">
                          {reg.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm">{reg.name}</p>
                          <p className="text-gray-500 text-[10px]">{new Date(reg.registeredAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <span className={`badge-${reg.status || 'active'} text-[10px]`}>{reg.status || 'Registered'}</span>
                    </div>

                    {/* Full Form Data Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      {Object.entries(reg.formData || {}).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{key.replace(/_/g, ' ')}</span>
                          <span className="text-sm text-gray-300">
                            {Array.isArray(value) ? value.join(', ') : (value?.toString() || 'N/A')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
