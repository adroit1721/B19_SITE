import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveEvent, selectActiveEvent, selectEvents, fetchEvents } from '../features/events/eventSlice';
import { fetchAbout, selectAbout } from '../features/about/aboutSlice';
import { fetchGallery, selectGallery } from '../features/gallery/gallerySlice';
import { CalendarDays, MapPin, Users, ArrowRight, Sparkles, GraduationCap, Star } from 'lucide-react';
import EventRegistrationBanner from '../components/EventRegistrationBanner';

export default function Home() {
  const dispatch     = useDispatch();
  const activeEvent  = useSelector(selectActiveEvent);
  const events       = useSelector(selectEvents);
  const about        = useSelector(selectAbout);
  const gallery      = useSelector(selectGallery);

  useEffect(() => {
    dispatch(fetchActiveEvent());
    dispatch(fetchEvents({ status: 'upcoming' }));
    dispatch(fetchAbout());
    dispatch(fetchGallery());
  }, [dispatch]);

  const stats = about?.stats || [
    { label: 'Batch Year', value: '2019', icon: '🎓' },
    { label: 'Members',    value: '50+',  icon: '👥' },
    { label: 'Events',     value: '3+',   icon: '🎉' },
    { label: 'School',     value: '50+ Yrs', icon: '🏫' },
  ];

  const photos = gallery.filter((g) => g.type === 'photo').slice(0, 6);

  return (
    <main id="home-page" className="pt-20">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section id="hero-section" className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/3 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,245,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="section-container relative z-10 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              SSC Batch-2019 · Rajabari Hat High School
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-5xl md:text-7xl leading-none tracking-tight">
              <span className="text-white">Welcome to</span>
              <br />
              <span className="neon-text">Backbencher&apos;s</span>
              <span className="text-white"> 19</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {about?.heroSubtitle || 'A digital home for the legends who sat at the back. Reliving memories, celebrating milestones, staying connected forever.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/events" id="hero-events-btn" className="btn-neon flex items-center gap-2 text-base">
                <CalendarDays className="w-5 h-5" />
                View Events
              </Link>
              <Link to="/about" id="hero-about-btn" className="btn-outline-neon flex items-center gap-2 text-base">
                Our Story
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              {stats.map((stat, i) => (
                <div key={i} className="glass-card p-5 text-center group hover:border-neon-cyan/20 transition-all duration-300">
                  <div className="text-3xl mb-1">{stat.icon}</div>
                  <div className="font-display font-bold text-2xl neon-text">{stat.value}</div>
                  <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Active Event Banner ───────────────────────────────────────── */}
      {activeEvent && (
        <section id="event-banner-section" className="section-container py-12">
          <EventRegistrationBanner event={activeEvent} />
        </section>
      )}

      {/* ── Gallery Preview ───────────────────────────────────────────── */}
      {photos.length > 0 && (
        <section id="gallery-preview-section" className="section-container py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-neon-purple text-sm font-medium mb-2">
                <Star className="w-4 h-4" /> Memories
              </div>
              <h2 className="section-heading text-white">
                Our <span className="neon-text-pink">Gallery</span>
              </h2>
            </div>
            <Link to="/gallery" className="btn-ghost flex items-center gap-2 text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((item, i) => (
              <Link
                key={item._id}
                to="/gallery"
                className={`group relative overflow-hidden rounded-2xl bg-dark-800 ${
                  i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                style={{ aspectRatio: i === 0 ? '16/9' : '4/3' }}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-medium text-sm">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Upcoming Events Preview ───────────────────────────────────── */}
      {events.length > 0 && (
        <section id="upcoming-events-section" className="section-container py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-neon-cyan text-sm font-medium mb-2">
                <CalendarDays className="w-4 h-4" /> Coming Up
              </div>
              <h2 className="section-heading text-white">
                Upcoming <span className="neon-text">Events</span>
              </h2>
            </div>
            <Link to="/events" className="btn-ghost flex items-center gap-2 text-sm">
              All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="glass-card p-6 hover:border-neon-cyan/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`badge-${event.status}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-white group-hover:text-neon-cyan transition-colors mb-3">
                  {event.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{event.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-neon-cyan" />
                    {new Date(event.date).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neon-purple" />
                    {event.venue}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA Section ───────────────────────────────────────────────── */}
      <section id="cta-section" className="section-container py-20">
        <div className="glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5" />
          <div className="relative z-10">
            <GraduationCap className="w-16 h-16 text-neon-cyan mx-auto mb-6 animate-float" />
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
              Once a <span className="neon-text">backbencher</span>, always a backbencher.
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Join our community of SSC Batch-2019 graduates. Stay connected, relive the memories, and celebrate every milestone together.
            </p>
            <Link to="/events" className="btn-neon inline-flex items-center gap-2">
              <Users className="w-5 h-5" /> Join the Next Event
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
