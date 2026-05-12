// src/store/slices/slaughterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createSlaughterRecord = createAsyncThunk('slaughter/create', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/createSlaughter`, data, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create slaughter');
    }
});


// Alias for convenience
export const createSlaughter = createSlaughterRecord;

export const fetchSlaughterRecords = createAsyncThunk('slaughter/getAll', async (branchId, { rejectWithValue }) => {
    try {
        const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : '';
        const response = await axios.get(`${API_URL}/getAllSlaughters${query}`, { withCredentials: true });
        return response.data.data || response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to get slaughters');
    }
});

// Alias
export const getAllSlaughters = fetchSlaughterRecords;

export const updateSlaughter = createAsyncThunk('slaughter/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/updateSlaughterRecord/${id}`, data, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update slaughter');
    }
});

export const deleteSlaughter = createAsyncThunk('slaughter/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/deleteSlaughterRecord/${id}`, { withCredentials: true });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete slaughter');
    }
});

const slaughterSlice = createSlice({
    name: 'slaughter',
    initialState: {
        slaughters: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetSlaughterState: (state) => {
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createSlaughterRecord.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(createSlaughterRecord.fulfilled, (state) => { state.loading = false; state.success = true; })
            .addCase(createSlaughterRecord.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchSlaughterRecords.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchSlaughterRecords.fulfilled, (state, action) => { state.loading = false; state.slaughters = action.payload; })
            .addCase(fetchSlaughterRecords.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updateSlaughter.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(updateSlaughter.fulfilled, (state) => { state.loading = false; state.success = true; })
            .addCase(updateSlaughter.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(deleteSlaughter.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteSlaughter.fulfilled, (state, action) => {
                state.loading = false;
                state.slaughters = state.slaughters.filter(s => s._id !== action.payload);
            })
            .addCase(deleteSlaughter.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    }
});

export const { resetSlaughterState } = slaughterSlice.actions;
export default slaughterSlice.reducer;
