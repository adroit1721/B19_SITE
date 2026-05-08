import { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Phone, Clock } from 'lucide-react';

export default function ParticipantSummary({ eventId, isAdmin = false }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const endpoint = isAdmin 
          ? `/events/${eventId}/registrations` 
          : `/events/${eventId}/participants`;
        const { data } = await api.get(endpoint);
        setParticipants(data.data);
      } catch (err) {
        console.error('Failed to fetch participants', err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchParticipants();
  }, [eventId, isAdmin]);

  if (loading) return <div className="flex justify-center p-4"><div className="spinner w-6 h-6" /></div>;

  if (participants.length === 0) return (
    <div className="text-center py-6 text-gray-600 text-sm italic">
      No participants registered yet.
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-3 h-3" /> Participants ({participants.length})
        </h4>
      </div>
      <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
        {participants.map((p, i) => (
          <div key={p._id || i} className="p-4 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center text-neon-cyan font-bold text-xs">
                  {p.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{p.name}</p>
                  <p className="text-[10px] text-gray-600 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(p.registeredAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`badge-${p.status || 'active'} text-[9px]`}>{p.status || 'Registered'}</span>
            </div>

            {/* Read-only Public View of Form Data */}
            {p.formData && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(p.formData).map(([key, value]) => {
                  // Skip common internal fields or very long ones if needed
                  if (['name', 'email', 'phone'].includes(key.toLowerCase())) return null;
                  return (
                    <div key={key} className="flex flex-col">
                      <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter truncate">{key.replace(/_/g, ' ')}</span>
                      <span className="text-[11px] text-gray-400 truncate">
                        {Array.isArray(value) ? value.join(', ') : (value?.toString() || 'N/A')}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
