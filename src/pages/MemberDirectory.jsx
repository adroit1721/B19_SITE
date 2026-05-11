import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers, selectMembers } from '../features/members/memberSlice';
import { Link } from 'react-router-dom';
import { Search, User, Mail, Phone, Briefcase, Globe, Facebook, Linkedin, Instagram, MessageCircle, Filter, UserPlus } from 'lucide-react';

const groups = ['All', 'Science', 'Commerce', 'Arts', 'Other'];

export default function MemberDirectory() {
  const dispatch = useDispatch();
  const members  = useSelector(selectMembers);
  const { loading, total, page, totalPages } = useSelector((s) => s.members);
  const [filters, setFilters] = useState({ group: 'All', search: '' });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    dispatch(fetchMembers({ 
      group: filters.group === 'All' ? '' : filters.group, 
      search: debouncedSearch 
    }));
  }, [dispatch, filters.group, debouncedSearch]);

  const handlePageChange = (newPage) => {
    dispatch(fetchMembers({ 
      group: filters.group === 'All' ? '' : filters.group, 
      search: debouncedSearch,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main id="member-directory" className="pt-24 pb-20">
      <section className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-sm font-medium mb-4">
              <Globe className="w-4 h-4" /> Batch Directory
            </div>
            <h1 className="font-display font-black text-5xl text-white mb-4">
              Connect with <span className="neon-text-purple">Batchmates</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">Find and reconnect with the legends of SSC Batch 2019.</p>
          </div>
          <Link to="/register" className="btn-neon flex items-center gap-2 py-4 px-8 shadow-neon-purple hover:scale-105 transition-transform">
            <UserPlus className="w-5 h-5" /> Register as Member
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              className="input-neon pl-12 py-4" 
              placeholder="Search by name, occupation, organization..." 
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
            {groups.map((g) => (
              <button 
                key={g}
                onClick={() => setFilters({ ...filters, group: g })}
                className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                  filters.group === g 
                    ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-neon-sm' 
                    : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Members Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner-purple w-12 h-12" /></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((m) => (
                <div key={m._id} className="glass-card group hover:border-neon-purple/30 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative aspect-square overflow-hidden rounded-t-3xl">
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-700 flex items-center justify-center">
                        <User className="w-20 h-20 text-dark-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="px-3 py-1 rounded-full bg-neon-purple/20 backdrop-blur-md border border-neon-purple/30 text-neon-purple text-[10px] font-bold uppercase tracking-wider">
                        {m.group}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-white mb-1 group-hover:text-neon-purple transition-colors">{m.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-1">{m.occupation || 'Batchmate'}</p>
                    
                    <div className="space-y-3 mb-6">
                      {m.organization && (
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <Briefcase className="w-4 h-4 text-neon-purple/50" />
                          <span className="truncate">{m.organization}</span>
                        </div>
                      )}
                      {(m.email && m.isPublic) && (
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <Mail className="w-4 h-4 text-neon-purple/50" />
                          <span className="truncate">{m.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                      {m.socialLinks?.facebook && (
                        <a href={m.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-[#1877F2] hover:bg-[#1877F2]/10 transition-all">
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {m.socialLinks?.linkedin && (
                        <a href={m.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {m.socialLinks?.instagram && (
                        <a href={m.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-[#E4405F] hover:bg-[#E4405F]/10 transition-all">
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {m.socialLinks?.whatsapp && (
                        <a href={`https://wa.me/${m.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-[#25D366] hover:bg-[#25D366]/10 transition-all">
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {members.length === 0 && (
              <div className="text-center py-20">
                <User className="w-20 h-20 text-gray-800 mx-auto mb-6 opacity-20" />
                <h3 className="text-white text-xl font-bold mb-2">No Members Found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button 
                    key={p} 
                    onClick={() => handlePageChange(p)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                      page === p 
                        ? 'bg-neon-purple text-dark-950 shadow-neon-purple' 
                        : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
