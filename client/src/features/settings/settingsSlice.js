import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSettings = createAsyncThunk('settings/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/settings');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch settings');
  }
});

export const updateSettings = createAsyncThunk('settings/update', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/settings', formData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update settings');
  }
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { data: null, loading: false, error: null, successMsg: '' },
  reducers: {
    clearSettingsMsg: (state) => { state.successMsg = ''; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(updateSettings.pending, (state) => { state.loading = true; })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.successMsg = 'Site settings updated successfully!';
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSettingsMsg } = settingsSlice.actions;
export const selectSettings = (state) => state.settings.data;
export default settingsSlice.reducer;
