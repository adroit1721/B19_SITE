import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, selectBlogs } from '../features/blogs/blogSlice';
import { BookOpen, Clock, Eye, ArrowRight } from 'lucide-react';

export default function Blogs() {
  const dispatch = useDispatch();
  const blogs    = useSelector(selectBlogs);
  const { loading } = useSelector((s) => s.blogs);

  useEffect(() => { dispatch(fetchBlogs()); }, [dispatch]);

  return (
    <main id="blogs-page" className="pt-20">
      <section className="section-container py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" /> Blog
          </div>
          <h1 className="font-display font-black text-5xl text-white mb-4">
            Stories &amp; <span className="neon-text">Updates</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">Thoughts, memories, and announcements from the Backbenchers.</p>
        </div>

        {loading && !blogs.length && <div className="flex justify-center py-20"><div className="spinner w-10 h-10" /></div>}

        {blogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link key={blog._id} to={`/blogs/${blog.slug}`}
                className="glass-card overflow-hidden hover:border-neon-purple/30 transition-all duration-300 group hover:-translate-y-1 flex flex-col">
                {blog.coverImage && (
                  <div className="h-48 overflow-hidden">
                    <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple text-xs border border-neon-purple/20">#{tag}</span>
                      ))}
                    </div>
                  )}
                  <h2 className="font-display font-bold text-lg text-white group-hover:text-neon-purple transition-colors mb-2 line-clamp-2">{blog.title}</h2>
                  <p className="text-gray-500 text-sm line-clamp-3 flex-1 mb-4">{blog.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-white/5">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Draft'}</span>
                    <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{blog.views} views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">No posts yet. Check back soon!</p>
          </div>
        )}
      </section>
    </main>
  );
}
