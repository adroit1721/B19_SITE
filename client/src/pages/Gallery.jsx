import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGallery, selectGallery } from '../features/gallery/gallerySlice';
import { Image, Video, X, Play } from 'lucide-react';

export default function Gallery() {
  const dispatch = useDispatch();
  const items    = useSelector(selectGallery);
  const { loading } = useSelector((s) => s.gallery);
  const [filter,    setFilter]    = useState('all');
  const [lightbox,  setLightbox]  = useState(null);

  useEffect(() => { dispatch(fetchGallery()); }, [dispatch]);

  const filtered = filter === 'all' ? items : items.filter((i) => i.type === filter);

  return (
    <main id="gallery-page" className="pt-20">
      <section className="section-container py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-sm font-medium mb-4">
            <Image className="w-4 h-4" /> Gallery
          </div>
          <h1 className="font-display font-black text-5xl text-white mb-4">
            Our <span className="neon-text-pink">Memories</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">Captured moments from our journey together.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8">
          {['all', 'photo', 'video'].map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)} id={`gallery-filter-${tab}`}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${filter === tab ? 'bg-neon-pink/10 text-neon-pink border border-neon-pink/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              {tab === 'all' ? 'All' : tab === 'photo' ? '📸 Photos' : '🎥 Videos'}
            </button>
          ))}
        </div>

        {loading && !items.length && <div className="flex justify-center py-20"><div className="spinner w-10 h-10" /></div>}

        {/* Masonry Grid */}
        {filtered.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((item) => (
              <div key={item._id} onClick={() => setLightbox(item)}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl bg-dark-800 mb-4">
                {item.type === 'photo' ? (
                  <img src={item.url} alt={item.title} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="relative aspect-video bg-dark-700 flex items-center justify-center">
                    <Play className="w-12 h-12 text-neon-cyan" />
                    {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-20">
            <Image className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">No {filter === 'all' ? 'media' : filter + 's'} yet.</p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div id="gallery-lightbox" onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
            <X className="w-6 h-6" />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full">
            {lightbox.type === 'photo' ? (
              <img src={lightbox.url} alt={lightbox.title} className="w-full max-h-[80vh] object-contain rounded-2xl" />
            ) : (
              <video src={lightbox.url} controls autoPlay className="w-full max-h-[80vh] rounded-2xl" />
            )}
            <p className="text-white font-medium mt-4 text-center">{lightbox.title}</p>
          </div>
        </div>
      )}
    </main>
  );
}
