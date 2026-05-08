import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchFooter  = createAsyncThunk('footer/fetch',  async (_, { rejectWithValue }) => {
  try { const res = await api.get('/footer'); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const updateFooter = createAsyncThunk('footer/update', async (data, { rejectWithValue }) => {
  try { const res = await api.put('/footer', data); return res.data.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed'); }
});

const footerSlice = createSlice({
  name: 'footer',
  initialState: { data: null, loading: false, error: null, successMsg: null },
  reducers: {
    clearFooterMsg(state) { state.successMsg = null; state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFooter.pending,   (state) => { state.loading = true; })
      .addCase(fetchFooter.fulfilled, (state, { payload }) => { state.loading = false; state.data = payload; })
      .addCase(fetchFooter.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(updateFooter.pending,   (state) => { state.loading = true; })
      .addCase(updateFooter.fulfilled, (state, { payload }) => {
        state.loading    = false;
        state.data       = payload;
        state.successMsg = 'Footer updated!';
      })
      .addCase(updateFooter.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; });
  },
});

export const { clearFooterMsg } = footerSlice.actions;
export default footerSlice.reducer;
export const selectFooter = (state) => state.footer.data;
