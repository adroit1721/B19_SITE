import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchGallery = createAsyncThunk('gallery/fetchPublic', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/gallery', { params });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch gallery');
  }
});

export const fetchGalleryAdmin = createAsyncThunk('gallery/fetchAdmin', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/gallery/admin');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch gallery');
  }
});

export const uploadGalleryItem = createAsyncThunk('gallery/upload', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Upload failed');
  }
});

export const deleteGalleryItem = createAsyncThunk('gallery/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/gallery/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Delete failed');
  }
});

const gallerySlice = createSlice({
  name: 'gallery',
  initialState: { items: [], loading: false, error: null, successMsg: null },
  reducers: {
    clearGalleryError(state)   { state.error = null; },
    clearGalleryMsg(state)     { state.successMsg = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending,  (state) => { state.loading = true; })
      .addCase(fetchGallery.fulfilled,(state, { payload }) => { state.loading = false; state.items = payload; })
      .addCase(fetchGallery.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(fetchGalleryAdmin.pending,  (state) => { state.loading = true; })
      .addCase(fetchGalleryAdmin.fulfilled,(state, { payload }) => { state.loading = false; state.items = payload; })
      .addCase(fetchGalleryAdmin.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(uploadGalleryItem.pending,  (state) => { state.loading = true; state.error = null; })
      .addCase(uploadGalleryItem.fulfilled,(state, { payload }) => {
        state.loading    = false;
        state.items      = [payload, ...state.items];
        state.successMsg = 'Uploaded successfully!';
      })
      .addCase(uploadGalleryItem.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(deleteGalleryItem.fulfilled,(state, { payload }) => {
        state.items      = state.items.filter((i) => i._id !== payload);
        state.successMsg = 'Deleted successfully!';
      });
  },
});

export const { clearGalleryError, clearGalleryMsg } = gallerySlice.actions;
export default gallerySlice.reducer;
export const selectGallery = (state) => state.gallery.items;
