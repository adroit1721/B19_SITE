import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMembers = createAsyncThunk('members/fetchAll', async (params) => {
  const { data } = await api.get('/members', { params });
  return data;
});

export const fetchMembersAdmin = createAsyncThunk('members/fetchAdmin', async () => {
  const { data } = await api.get('/members/admin');
  return data;
});

export const createMember = createAsyncThunk('members/create', async (memberData) => {
  const { data } = await api.post('/members', memberData);
  return data;
});

export const updateMember = createAsyncThunk('members/update', async ({ id, data: memberData }) => {
  const { data } = await api.put(`/members/${id}`, memberData);
  return data;
});

export const deleteMember = createAsyncThunk('members/delete', async (id) => {
  await api.delete(`/members/${id}`);
  return id;
});

export const registerMember = createAsyncThunk('members/register', async (memberData) => {
  const { data } = await api.post('/members/register', memberData);
  return data;
});

const memberSlice = createSlice({
  name: 'members',
  initialState: {
    data: [],
    adminData: [],
    loading: false,
    error: null,
    successMsg: null,
    total: 0,
    page: 1,
    totalPages: 1,
  },
  reducers: {
    clearMemberMsg: (state) => { state.successMsg = null; },
    clearMemberError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => { state.loading = true; })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMembersAdmin.fulfilled, (state, action) => {
        state.adminData = action.payload.data;
      })
      .addCase(createMember.fulfilled, (state) => {
        state.successMsg = 'Member added successfully';
      })
      .addCase(registerMember.fulfilled, (state, action) => {
        state.successMsg = action.payload.message || 'Registration successful! Waiting for approval.';
      })
      .addCase(updateMember.fulfilled, (state) => {
        state.successMsg = 'Member updated successfully';
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.adminData = state.adminData.filter((m) => m._id !== action.payload);
        state.successMsg = 'Member deleted';
      });
  },
});

export const { clearMemberMsg, clearMemberError } = memberSlice.actions;
export const selectMembers = (state) => state.members.data;
export const selectAdminMembers = (state) => state.members.adminData;
export default memberSlice.reducer;
