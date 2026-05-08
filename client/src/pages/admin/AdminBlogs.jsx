import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogsAdmin, createBlog, updateBlog, deleteBlog, selectBlogs, clearBlogError, clearBlogMsg } from '../../features/blogs/blogSlice';
import { Plus, Trash2, Edit, Eye, EyeOff, X, Save, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { title: '', slug: '', content: '', excerpt: '', coverImage: '', author: 'Admin', tags: '', isPublished: false };

export default function AdminBlogs() {
  const dispatch = useDispatch();
  const blogs    = useSelector(selectBlogs);
  const { loading, successMsg, error } = useSelector((s) => s.blogs);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);

  useEffect(() => { dispatch(fetchBlogsAdmin()); }, [dispatch]);
  useEffect(() => {
    if (successMsg) { toast.success(successMsg); dispatch(clearBlogMsg()); setShowForm(false); setEditing(null); setForm(EMPTY); }
    if (error)      { toast.error(error);        dispatch(clearBlogError()); }
  }, [successMsg, error, dispatch]);

  const autoSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleEdit = (blog) => {
    setEditing(blog._id);
    setForm({ ...blog, tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '' });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) };
    if (!data.slug) data.slug = autoSlug(data.title);
    if (editing) dispatch(updateBlog({ id: editing, data }));
    else         dispatch(createBlog(data));
  };

  const handleDelete = (id) => { if (window.confirm('Delete this blog?')) dispatch(deleteBlog(id)); };

  return (
    <div id="admin-blogs" className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-1">Blog Management</h1>
          <p className="text-gray-500 text-sm">{blogs.length} posts · {blogs.filter((b) => b.isPublished).length} published</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY); }} className="btn-neon flex items-center gap-2"><Plus className="w-4 h-4" />New Post</button>
      </div>

      {showForm && (
        <div className="glass-card p-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl text-white">{editing ? 'Edit Post' : 'New Blog Post'}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                <input className="input-neon" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: autoSlug(e.target.value) })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
                <input className="input-neon font-mono text-sm" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt</label>
                <input className="input-neon" placeholder="Short summary..." value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Content *</label>
                <textarea className="input-neon min-h-[200px] font-mono text-sm" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image URL</label>
                <input className="input-neon" placeholder="https://..." value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma separated)</label>
                <input className="input-neon" placeholder="reunion, news, memory" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Author</label>
                <input className="input-neon" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <button type="button" onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${form.isPublished ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                  {form.isPublished ? <><Eye className="w-4 h-4" />Published</> : <><EyeOff className="w-4 h-4" />Draft</>}
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-neon flex items-center gap-2 disabled:opacity-50">
                {loading ? <><span className="spinner w-4 h-4" />Saving...</> : <><Save className="w-4 h-4" />{editing ? 'Update' : 'Create'} Post</>}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/8">
            {['Title','Author','Status','Views','Actions'].map((h) => (
              <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-white/5">
            {loading && !blogs.length ? <tr><td colSpan={5} className="px-6 py-12 text-center"><div className="spinner w-8 h-8 mx-auto" /></td></tr> :
            blogs.length === 0 ? <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-600">No blogs yet.</td></tr> :
            blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-white/2">
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{blog.title}</p>
                  <p className="text-gray-600 text-xs font-mono">/{blog.slug}</p>
                </td>
                <td className="px-6 py-4 text-gray-500">{blog.author}</td>
                <td className="px-6 py-4">
                  <span className={`badge ${blog.isPublished ? 'badge-active' : 'badge-upcoming'}`}>{blog.isPublished ? 'Published' : 'Draft'}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{blog.views || 0}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(blog)} className="p-2 rounded-lg bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(blog._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
