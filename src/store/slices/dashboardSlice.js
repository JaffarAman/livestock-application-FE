import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchAdminStats = createAsyncThunk('dashboard/fetchAdminStats', async (range, { rejectWithValue }) => {
    try {
        const url = range ? `${API_URL}/getAdminStats?range=${encodeURIComponent(range)}` : `${API_URL}/getAdminStats`;
        const response = await axios.get(url, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin stats');
    }
});

export const fetchBranchStats = createAsyncThunk('dashboard/fetchBranchStats', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/getBranchStats`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch branch stats');
    }
});

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        loading: false,
        error: null,
        stats: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchAdminStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBranchStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBranchStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchBranchStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default dashboardSlice.reducer;
