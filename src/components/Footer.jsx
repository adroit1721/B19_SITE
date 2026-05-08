import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFooter, selectFooter } from '../features/footer/footerSlice';
import { fetchSettings, selectSettings } from '../features/settings/settingsSlice';
import { Link as LinkIcon, Camera, Video, Share2, GraduationCap, Mail, Phone, MapPin, Heart } from 'lucide-react';

const SocialIcon = ({ platform, url }) => {
  const icons = {
    facebook:  <LinkIcon className="w-4 h-4" />,
    instagram: <Camera className="w-4 h-4" />,
    youtube:   <Video className="w-4 h-4" />,
    twitter:   <Share2 className="w-4 h-4" />,
  };
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/30 hover:bg-neon-cyan/5 transition-all duration-200"
      aria-label={platform}
    >
      {icons[platform]}
    </a>
  );
};

export default function Footer() {
  const dispatch = useDispatch();
  const footer   = useSelector(selectFooter);
  const settings = useSelector(selectSettings);

  useEffect(() => { 
    dispatch(fetchFooter()); 
    if (!settings) dispatch(fetchSettings());
  }, [dispatch, settings]);

  const data = footer || {};

  return (
    <footer id="main-footer" className="relative mt-20 border-t border-white/8">
      {/* Glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />

      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand Column ────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/20 flex items-center justify-center">
                <img
                  src={settings?.logoUrl || "/images/logo.png"}
                  alt="Logo"
                  className="h-8 w-8 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                />
                <GraduationCap className="h-6 w-6 text-neon-cyan hidden" />
              </div>
              <div>
                <p className="font-display font-bold text-xl">
                  {settings?.siteName || data.groupName || "Backbencher's 19"}
                </p>
                <p className="text-gray-500 text-xs font-mono">{data.batchName || 'SSC BATCH-2019'}</p>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              {data.description || "A digital home for the SSC Batch-2019 graduates of Rajabari Hat High School."}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {Object.entries(data.socialLinks || {}).map(([platform, url]) => (
                <SocialIcon key={platform} platform={platform} url={url} />
              ))}
            </div>

            {/* Tagline */}
            {data.tagline && (
              <p className="text-neon-cyan/70 text-sm font-mono italic">
                &ldquo;{data.tagline}&rdquo;
              </p>
            )}
          </div>

          {/* ── Quick Links ──────────────────────────────────────────── */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-widest">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {(data.quickLinks || [{ label: 'Home', url: '/' }, { label: 'About', url: '/about' }, { label: 'Events', url: '/events' }, { label: 'Gallery', url: '/gallery' }]).map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.url}
                    className="text-gray-400 hover:text-neon-cyan text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-neon-cyan/40 group-hover:bg-neon-cyan transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ──────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-widest">
              Contact
            </h3>
            <ul className="space-y-3">
              {data.email && (
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                  <a href={`mailto:${data.email}`} className="hover:text-white transition-colors">{data.email}</a>
                </li>
              )}
              {data.phone && (
                <li className="flex items-center gap-3 text-gray-400 text-sm">
                  <Phone className="w-4 h-4 text-neon-purple flex-shrink-0" />
                  <a href={`tel:${data.phone}`} className="hover:text-white transition-colors">{data.phone}</a>
                </li>
              )}
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-neon-pink flex-shrink-0 mt-0.5" />
                <span>{data.address || 'Rajabari Hat High School, Bangladesh'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ──────────────────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col items-center gap-4 text-center">
          <p className="text-gray-600 text-sm">
            {data.copyrightText || `© ${new Date().getFullYear()} Backbencher's 19. All rights reserved.`}
          </p>
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-700 text-xs flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-neon-pink fill-current" /> by the Batch of 2019
            </p>
            <Link to="/admin/login" className="mt-4 text-gray-800 hover:text-neon-cyan transition-all text-[10px] uppercase tracking-[0.2em] opacity-30 hover:opacity-100 font-mono py-2 px-4 rounded-full border border-white/5 hover:border-neon-cyan/20">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
