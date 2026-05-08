import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Thunks ──────────────────────────────────────────────────────────────────

export const loginAdmin = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      const { token, admin } = res.data;
      localStorage.setItem('bb19_token', token);
      localStorage.setItem('bb19_admin', JSON.stringify(admin));
      return { token, admin };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/me');
      return res.data.admin;
    } catch (err) {
      localStorage.removeItem('bb19_token');
      localStorage.removeItem('bb19_admin');
      return rejectWithValue(err.response?.data?.message || 'Session expired');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const res = await api.put('/auth/change-password', { currentPassword, newPassword });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to change password');
    }
  }
);

// ── Initial State ────────────────────────────────────────────────────────────

const storedAdmin = localStorage.getItem('bb19_admin');
const storedToken = localStorage.getItem('bb19_token');

const initialState = {
  admin:          storedAdmin ? JSON.parse(storedAdmin) : null,
  token:          storedToken || null,
  isAuthenticated: !!storedToken,
  loading:        false,
  error:          null,
  passwordMsg:    null,
};

// ── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.admin          = null;
      state.token          = null;
      state.isAuthenticated = false;
      state.error          = null;
      localStorage.removeItem('bb19_token');
      localStorage.removeItem('bb19_admin');
    },
    clearAuthError(state)   { state.error       = null; },
    clearPasswordMsg(state) { state.passwordMsg  = null; },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAdmin.pending,  (state) => { state.loading = true;  state.error = null; })
      .addCase(loginAdmin.fulfilled,(state, { payload }) => {
        state.loading        = false;
        state.isAuthenticated = true;
        state.token          = payload.token;
        state.admin          = payload.admin;
      })
      .addCase(loginAdmin.rejected, (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
      });

    // Get Me
    builder
      .addCase(getMe.pending,  (state) => { state.loading = true; })
      .addCase(getMe.fulfilled,(state, { payload }) => {
        state.loading        = false;
        state.isAuthenticated = true;
        state.admin          = payload;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading        = false;
        state.isAuthenticated = false;
        state.admin          = null;
        state.token          = null;
      });

    // Change Password
    builder
      .addCase(changePassword.pending,  (state) => { state.loading = true;  state.error = null; state.passwordMsg = null; })
      .addCase(changePassword.fulfilled,(state, { payload }) => {
        state.loading    = false;
        state.passwordMsg = payload;
      })
      .addCase(changePassword.rejected, (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
      });
  },
});

export const { logout, clearAuthError, clearPasswordMsg } = authSlice.actions;
export default authSlice.reducer;

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectAuth           = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAdmin           = (state) => state.auth.admin;
