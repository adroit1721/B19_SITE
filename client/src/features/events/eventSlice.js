import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Thunks ──────────────────────────────────────────────────────────────────

export const fetchEvents = createAsyncThunk('events/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/events', { params });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch events');
  }
});

export const fetchActiveEvent = createAsyncThunk('events/fetchActive', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/events/active');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch active event');
  }
});

export const fetchEvent = createAsyncThunk('events/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/events/${id}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch event');
  }
});

export const createEvent = createAsyncThunk('events/create', async (eventData, { rejectWithValue }) => {
  try {
    const res = await api.post('/events', eventData);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create event');
  }
});

export const updateEvent = createAsyncThunk('events/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/events/${id}`, data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update event');
  }
});

export const deleteEvent = createAsyncThunk('events/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/events/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete event');
  }
});

export const registerForEvent = createAsyncThunk('events/register', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/events/${id}/register`, { formData });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchRegistrations = createAsyncThunk('events/fetchRegistrations', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/events/${id}/registrations`);
    return { id, data: res.data.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch registrations');
  }
});

export const fetchParticipants = createAsyncThunk('events/fetchParticipants', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/events/${id}/participants`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch participants');
  }
});

// ── Slice ────────────────────────────────────────────────────────────────────

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    events:        [],
    activeEvent:   null,
    currentEvent:  null,
    registrations: {},
    participants:  [],
    loading:       false,
    registering:   false,
    error:         null,
    successMsg:    null,
  },
  reducers: {
    clearEventError(state)   { state.error      = null; },
    clearSuccessMsg(state)   { state.successMsg = null; },
  },
  extraReducers: (builder) => {
    const setLoading    = (state) => { state.loading = true;  state.error = null; };
    const setError      = (state, { payload }) => { state.loading = false; state.error = payload; };

    builder
      .addCase(fetchEvents.pending,   setLoading)
      .addCase(fetchEvents.fulfilled, (state, { payload }) => { state.loading = false; state.events = payload; })
      .addCase(fetchEvents.rejected,  setError)

      .addCase(fetchActiveEvent.pending,   setLoading)
      .addCase(fetchActiveEvent.fulfilled, (state, { payload }) => { state.loading = false; state.activeEvent = payload; })
      .addCase(fetchActiveEvent.rejected,  (state) => { state.loading = false; state.activeEvent = null; })

      .addCase(fetchEvent.pending,   setLoading)
      .addCase(fetchEvent.fulfilled, (state, { payload }) => { state.loading = false; state.currentEvent = payload; })
      .addCase(fetchEvent.rejected,  setError)

      .addCase(createEvent.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.events  = [payload, ...state.events];
        state.successMsg = 'Event created successfully!';
      })

      .addCase(updateEvent.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.events  = state.events.map((e) => (e._id === payload._id ? payload : e));
        state.successMsg = 'Event updated successfully!';
      })

      .addCase(deleteEvent.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.events  = state.events.filter((e) => e._id !== payload);
        state.successMsg = 'Event deleted successfully!';
      })

      .addCase(registerForEvent.pending,   (state) => { state.registering = true;  state.error = null; })
      .addCase(registerForEvent.fulfilled, (state, { payload }) => {
        state.registering = false;
        state.successMsg  = payload.message || 'Registration successful!';
      })
      .addCase(registerForEvent.rejected,  (state, { payload }) => { state.registering = false; state.error = payload; })

      .addCase(fetchRegistrations.fulfilled, (state, { payload }) => {
        state.registrations = { ...state.registrations, [payload.id]: payload.data };
      })

      .addCase(fetchParticipants.fulfilled, (state, { payload }) => { state.participants = payload; });
  },
});

export const { clearEventError, clearSuccessMsg } = eventSlice.actions;
export default eventSlice.reducer;

export const selectEvents       = (state) => state.events.events;
export const selectActiveEvent  = (state) => state.events.activeEvent;
export const selectCurrentEvent = (state) => state.events.currentEvent;
export const selectParticipants = (state) => state.events.participants;
export const selectRegistrations = (id) => (state) => state.events.registrations[id] || [];
