import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerForEvent, fetchParticipants, selectParticipants, clearSuccessMsg } from '../features/events/eventSlice';
import { CalendarDays, MapPin, Users, X, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

function FormField({ field, value, onChange }) {
  const base = 'input-neon';
  if (field.type === 'textarea') return (
    <textarea id={`field-${field.name}`} className={`${base} min-h-[100px] resize-y`}
      placeholder={field.placeholder} value={value || ''} required={field.required} rows={4}
      onChange={(e) => onChange(field.name, e.target.value)} />
  );
  if (field.type === 'select') return (
    <div className="relative">
      <select id={`field-${field.name}`} className={`${base} appearance-none cursor-pointer`}
        value={value || ''} required={field.required} onChange={(e) => onChange(field.name, e.target.value)}>
        <option value="">Select...</option>
        {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  );
  return (
    <input id={`field-${field.name}`} type={field.type === 'phone' ? 'tel' : field.type}
      className={base} placeholder={field.placeholder} value={value || ''} required={field.required}
      onChange={(e) => onChange(field.name, e.target.value)} />
  );
}

export default function EventRegistrationBanner({ event }) {
  const dispatch = useDispatch();
  const participants = useSelector(selectParticipants);
  const { registering, successMsg, error } = useSelector((s) => s.events);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => { dispatch(fetchParticipants(event._id)); }, [dispatch, event._id]);
  useEffect(() => {
    if (successMsg && showForm) {
      toast.success(successMsg); setRegistered(true); setShowForm(false);
      dispatch(clearSuccessMsg()); dispatch(fetchParticipants(event._id));
    }
  }, [successMsg]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const handleChange = (name, val) => setFormData((p) => ({ ...p, [name]: val }));
  const handleSubmit = (e) => { e.preventDefault(); dispatch(registerForEvent({ id: event._id, formData })); };
  const sortedFields = [...(event.formSchema || [])].sort((a, b) => a.order - b.order);

  return (
    <div id="registration-banner" className="relative overflow-hidden rounded-3xl border border-neon-cyan/20">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-dark-800 to-neon-purple/10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
      <div className="relative p-8 md:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="badge-active animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-green-400" />Registration Open</span>
              {event.registrationDeadline && (
                <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                  <Clock className="w-3.5 h-3.5" />Deadline: {new Date(event.registrationDeadline).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white">{event.title}</h2>
            <p className="text-gray-400 max-w-xl">{event.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 pt-1">
              <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-neon-cyan" />{new Date(event.date).toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-neon-purple" />{event.venue}</span>
              {event.maxParticipants > 0 && <span className="flex items-center gap-2"><Users className="w-4 h-4 text-neon-pink" />{participants.length}/{event.maxParticipants} Registered</span>}
            </div>
          </div>
          {registered ? (
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400">
              <CheckCircle className="w-6 h-6" /><div><p className="font-semibold">You&apos;re Registered!</p><p className="text-xs text-green-500/70">See you at the event 🎉</p></div>
            </div>
          ) : (
            <button id="register-btn" onClick={() => setShowForm(!showForm)} className="btn-neon whitespace-nowrap flex items-center gap-2 text-base px-8 py-4">
              {showForm ? <><X className="w-5 h-5" />Close Form</> : <><Users className="w-5 h-5" />Register Now</>}
            </button>
          )}
        </div>

        {showForm && !registered && (
          <form id="registration-form" onSubmit={handleSubmit} className="animate-slide-up border-t border-white/8 pt-8 space-y-5">
            <h3 className="font-display font-semibold text-lg text-white mb-6">Fill in your details</h3>
            <div className="grid md:grid-cols-2 gap-5">
              {sortedFields.map((field) => (
                <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label htmlFor={`field-${field.name}`} className="block text-sm font-medium text-gray-400 mb-2">
                    {field.label}{field.required && <span className="text-neon-pink ml-1">*</span>}
                  </label>
                  <FormField field={field} value={formData[field.name]} onChange={handleChange} />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 pt-2">
              <button id="submit-registration-btn" type="submit" disabled={registering} className="btn-neon flex items-center gap-2 disabled:opacity-50">
                {registering ? <><span className="spinner w-4 h-4" />Submitting...</> : <><CheckCircle className="w-4 h-4" />Confirm Registration</>}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">Cancel</button>
            </div>
          </form>
        )}

        {participants.length > 0 && (
          <div id="recent-participants" className="mt-8 border-t border-white/8 pt-6">
            <p className="text-gray-500 text-sm font-medium mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-neon-cyan" />Recent Registrations ({participants.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {participants.slice(0, 15).map((p, i) => (
                <span key={i} className="participant-tag">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 flex items-center justify-center text-xs font-bold text-neon-cyan">{p.name.charAt(0).toUpperCase()}</span>
                  {p.name}
                </span>
              ))}
              {participants.length > 15 && <span className="participant-tag text-gray-500">+{participants.length - 15} more</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
