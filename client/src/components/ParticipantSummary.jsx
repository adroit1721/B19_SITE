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
          <div key={p._id || i} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center text-neon-cyan font-bold text-xs">
                {p.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{p.name}</p>
                {p.phone && (
                  <p className="text-gray-500 text-[10px] flex items-center gap-1">
                    <Phone className="w-2 h-2" /> {p.phone}
                  </p>
                )}
              </div>
            </div>
            <div className="text-[10px] text-gray-600 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {new Date(p.registeredAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
