import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchBlogs      = createAsyncThunk('blogs/fetchAll', async (params = {}, { rejectWithValue }) => {
  try { const res = await api.get('/blogs', { params }); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const fetchBlogsAdmin = createAsyncThunk('blogs/fetchAdmin', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/blogs/admin'); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const fetchBlog       = createAsyncThunk('blogs/fetchOne', async (slug, { rejectWithValue }) => {
  try { const res = await api.get(`/blogs/${slug}`); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Blog not found'); }
});

export const createBlog      = createAsyncThunk('blogs/create', async (data, { rejectWithValue }) => {
  try { const res = await api.post('/blogs', data); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const updateBlog      = createAsyncThunk('blogs/update', async ({ id, data }, { rejectWithValue }) => {
  try { const res = await api.put(`/blogs/${id}`, data); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const deleteBlog      = createAsyncThunk('blogs/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/blogs/${id}`); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

const blogSlice = createSlice({
  name: 'blogs',
  initialState: { blogs: [], currentBlog: null, loading: false, error: null, successMsg: null },
  reducers: {
    clearBlogError(state) { state.error = null; },
    clearBlogMsg(state)   { state.successMsg = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending,   (state) => { state.loading = true; })
      .addCase(fetchBlogs.fulfilled, (state, { payload }) => { state.loading = false; state.blogs = payload.data; })
      .addCase(fetchBlogs.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(fetchBlogsAdmin.pending,   (state) => { state.loading = true; })
      .addCase(fetchBlogsAdmin.fulfilled, (state, { payload }) => { state.loading = false; state.blogs = payload; })
      .addCase(fetchBlogsAdmin.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(fetchBlog.pending,   (state) => { state.loading = true; })
      .addCase(fetchBlog.fulfilled, (state, { payload }) => { state.loading = false; state.currentBlog = payload; })
      .addCase(fetchBlog.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(createBlog.fulfilled, (state, { payload }) => {
        state.blogs = [payload, ...state.blogs]; state.successMsg = 'Blog created!';
      })
      .addCase(updateBlog.fulfilled, (state, { payload }) => {
        state.blogs = state.blogs.map((b) => b._id === payload._id ? payload : b);
        state.successMsg = 'Blog updated!';
      })
      .addCase(deleteBlog.fulfilled, (state, { payload }) => {
        state.blogs = state.blogs.filter((b) => b._id !== payload);
        state.successMsg = 'Blog deleted!';
      });
  },
});

export const { clearBlogError, clearBlogMsg } = blogSlice.actions;
export default blogSlice.reducer;
export const selectBlogs       = (state) => state.blogs.blogs;
export const selectCurrentBlog = (state) => state.blogs.currentBlog;
