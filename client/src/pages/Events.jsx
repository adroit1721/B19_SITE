import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, selectEvents } from '../features/events/eventSlice';
import { CalendarDays, MapPin, Users, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import EventRegistrationBanner from '../components/EventRegistrationBanner';
import ParticipantSummary from '../components/ParticipantSummary';

const statusColors = { active: 'badge-active', upcoming: 'badge-upcoming', completed: 'badge-completed', cancelled: 'badge-cancelled' };

export default function Events() {
  const dispatch = useDispatch();
  const events   = useSelector(selectEvents);
  const { loading } = useSelector((s) => s.events);
  const [expanded, setExpanded] = useState({});

  useEffect(() => { dispatch(fetchEvents()); }, [dispatch]);

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const activeEvent    = events.find((e) => e.status === 'active');
  const otherEvents    = events.filter((e) => e.status !== 'active');

  return (
    <main id="events-page" className="pt-20">
      <section className="section-container py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-sm font-medium mb-4">
            <CalendarDays className="w-4 h-4" /> Events
          </div>
          <h1 className="font-display font-black text-5xl text-white mb-4">
            Our <span className="neon-text">Events</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">Reunions, celebrations, and every milestone that brings us together.</p>
        </div>

        {/* Active Event */}
        {activeEvent && (
          <div className="mb-16">
            <p className="text-green-400 text-sm font-medium mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Currently Active
            </p>
            <EventRegistrationBanner event={activeEvent} />
            
            <div className="mt-8 glass-card p-6">
              <ParticipantSummary eventId={activeEvent._id} />
            </div>
          </div>
        )}

        {loading && !events.length && (
          <div className="flex justify-center py-20"><div className="spinner w-10 h-10" /></div>
        )}

        {/* All Events Grid */}
        {otherEvents.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-2xl text-white mb-6">Past & Upcoming Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherEvents.map((event) => (
                <div key={event._id} className="glass-card p-6 hover:border-neon-cyan/20 transition-all duration-300 group">
                  {event.coverImage && (
                    <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
                      <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className={statusColors[event.status] || 'badge'}>{event.status}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-neon-cyan transition-colors mb-2">{event.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-neon-cyan" />{new Date(event.date).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-neon-purple" />{event.venue}</div>
                  </div>

                  <div className="border-t border-white/5 pt-4">
                    <button 
                      onClick={() => toggleExpand(event._id)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 hover:text-neon-cyan transition-colors"
                    >
                      <span>VIEW PARTICIPANTS</span>
                      {expanded[event._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expanded[event._id] && (
                      <div className="mt-4 animate-slide-down">
                        <ParticipantSummary eventId={event._id} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="text-center py-20">
            <CalendarDays className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No events yet. Stay tuned!</p>
          </div>
        )}
      </section>
    </main>
  );
}
