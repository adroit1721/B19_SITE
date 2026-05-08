import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAbout  = createAsyncThunk('about/fetch',  async (_, { rejectWithValue }) => {
  try { const res = await api.get('/about'); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const updateAbout = createAsyncThunk('about/update', async (data, { rejectWithValue }) => {
  try { const res = await api.put('/about', data); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

const aboutSlice = createSlice({
  name: 'about',
  initialState: { data: null, loading: false, error: null, successMsg: null },
  reducers: {
    clearAboutMsg(state) { state.successMsg = null; state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbout.pending,   (state) => { state.loading = true; })
      .addCase(fetchAbout.fulfilled, (state, { payload }) => { state.loading = false; state.data = payload; })
      .addCase(fetchAbout.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(updateAbout.fulfilled,(state, { payload }) => {
        state.loading = false; state.data = payload; state.successMsg = 'About updated!';
      });
  },
});

export const { clearAboutMsg } = aboutSlice.actions;
export default aboutSlice.reducer;
export const selectAbout = (state) => state.about.data;
