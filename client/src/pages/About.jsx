import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAbout, selectAbout } from '../features/about/aboutSlice';
import { GraduationCap, Target, Eye, Link as LinkIcon, Camera } from 'lucide-react';

export default function About() {
  const dispatch = useDispatch();
  const about    = useSelector(selectAbout);
  const { loading } = useSelector((s) => s.about);

  useEffect(() => { dispatch(fetchAbout()); }, [dispatch]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="spinner w-10 h-10" />
    </div>
  );

  const data = about || {};

  return (
    <main id="about-page" className="pt-20">
      {/* Hero */}
      <section className="section-container py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-sm font-medium mb-6">
          <GraduationCap className="w-4 h-4" /> Our Story
        </div>
        <h1 className="font-display font-black text-5xl md:text-6xl text-white mb-6">
          {data.heroTitle || 'We Are the'} <span className="neon-text">Backbenchers</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">{data.heroSubtitle}</p>
      </section>

      {/* Stats */}
      {data.stats?.length > 0 && (
        <section className="section-container pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.stats.map((s, i) => (
              <div key={i} className="glass-card p-6 text-center hover:border-neon-cyan/20 transition-all">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="font-display font-bold text-3xl neon-text mb-1">{s.value}</div>
                <div className="text-gray-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Story */}
      <section className="section-container py-16">
        <div className="max-w-3xl mx-auto glass-card p-10">
          <h2 className="font-display font-bold text-2xl text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan text-sm">📖</span>
            Our Story
          </h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{data.story}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      {(data.mission || data.vision) && (
        <section className="section-container py-16">
          <div className="grid md:grid-cols-2 gap-6">
            {data.mission && (
              <div className="glass-card p-8 hover:border-neon-cyan/20 transition-all">
                <Target className="w-8 h-8 text-neon-cyan mb-4" />
                <h3 className="font-display font-bold text-xl text-white mb-3">Our Mission</h3>
                <p className="text-gray-400 leading-relaxed">{data.mission}</p>
              </div>
            )}
            {data.vision && (
              <div className="glass-card p-8 hover:border-neon-purple/20 transition-all">
                <Eye className="w-8 h-8 text-neon-purple mb-4" />
                <h3 className="font-display font-bold text-xl text-white mb-3">Our Vision</h3>
                <p className="text-gray-400 leading-relaxed">{data.vision}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Team */}
      {data.teamMembers?.length > 0 && (
        <section className="section-container py-16">
          <h2 className="section-heading text-white text-center mb-10">
            The <span className="neon-text">Team</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.teamMembers.map((member, i) => (
              <div key={i} className="glass-card p-6 text-center hover:border-neon-cyan/20 transition-all group">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-4 ring-2 ring-neon-cyan/20" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-neon-cyan">
                    {member.name?.charAt(0)}
                  </div>
                )}
                <h4 className="font-semibold text-white group-hover:text-neon-cyan transition-colors">{member.name}</h4>
                <p className="text-gray-500 text-sm mt-1">{member.role}</p>
                {member.bio && <p className="text-gray-600 text-xs mt-2 line-clamp-2">{member.bio}</p>}
                <div className="flex justify-center gap-2 mt-3">
                  {member.social?.facebook && <a href={member.social.facebook} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-neon-cyan transition-colors"><LinkIcon className="w-4 h-4" /></a>}
                  {member.social?.instagram && <a href={member.social.instagram} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-neon-pink transition-colors"><Camera className="w-4 h-4" /></a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
